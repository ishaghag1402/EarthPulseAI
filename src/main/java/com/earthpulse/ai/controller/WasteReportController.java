
package com.earthpulse.ai.controller;

import com.earthpulse.ai.model.WasteReport;
import com.earthpulse.ai.repository.WasteReportRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/waste-reports")
public class WasteReportController {

    private final WasteReportRepository repository;

    private final Path uploadDir =
            Paths.get("uploads", "waste").toAbsolutePath().normalize();

    public WasteReportController(WasteReportRepository repository) {
        this.repository = repository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitReport(
            @RequestParam(required = false) String reporterName,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam MultipartFile image, Authentication authentication) {

        try {
            boolean hasCoordinates = latitude != null && longitude != null
                    && latitude >= -90 && latitude <= 90
                    && longitude >= -180 && longitude <= 180;
            boolean hasAddress = address != null && !address.isBlank();
            if (!hasCoordinates && !hasAddress) {
                return ResponseEntity.badRequest().body(Map.of("message", "Location is compulsory. Enter an address or use your current location."));
            }

            if (category.isBlank()
                    || description.isBlank() || image.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Please complete all required fields and upload a photo."));
            }

            if (image.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Image size must be 5 MB or less."));
            }

            String contentType = image.getContentType();

            if (contentType == null ||
                    !List.of("image/jpeg", "image/png", "image/webp")
                            .contains(contentType)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Only JPG, PNG and WEBP images are allowed."));
            }

            Files.createDirectories(uploadDir);

            String extension = switch (contentType) {
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                default -> ".jpg";
            };

            String fileName = UUID.randomUUID() + extension;
            Path destination = uploadDir.resolve(fileName).normalize();

            if (!destination.startsWith(uploadDir)) {
                return ResponseEntity.badRequest().build();
            }

            Files.copy(image.getInputStream(), destination,
                    StandardCopyOption.REPLACE_EXISTING);

            WasteReport report = new WasteReport();
            report.setReporterName(reporterName == null ? "" : reporterName.trim());
            report.setReporterEmail(authentication == null ? null : authentication.getName());
            report.setCategory(category);
            report.setDescription(description.trim());
            report.setAddress(address);
            report.setLatitude(latitude);
            report.setLongitude(longitude);
            report.setImagePath("/waste-images/" + fileName);
            report.setStatus("Pending");

            WasteReport saved = repository.save(report);

            return ResponseEntity.ok(Map.of(
                    "message", "Waste report submitted successfully!",
                    "reportId", saved.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Unable to save report. Please try again."));
        }
    }

    // Admin report list. Protect this endpoint with your ADMIN security rule.
    @GetMapping
    public List<WasteReport> getAllReports() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    // Admin status update. Protect this endpoint with your ADMIN security rule.
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        if (!List.of("Pending", "Under Review", "Resolved", "Rejected")
                .contains(status)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid status."));
        }

        return repository.findById(id)
                .map(report -> {
                    report.setStatus(status);
                    repository.save(report);
                    return ResponseEntity.ok(
                            Map.of("message", "Status updated successfully."));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
