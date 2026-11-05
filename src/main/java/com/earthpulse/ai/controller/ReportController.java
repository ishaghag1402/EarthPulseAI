package com.earthpulse.ai.controller;
import com.earthpulse.ai.model.CommunityReport;
import com.earthpulse.ai.service.ReportService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.nio.file.*;
@Controller
public class ReportController{
 private final ReportService service;
 @Value("${app.upload-dir:uploads}") private String uploadDir;
 ReportController(ReportService s){service=s;}
 @PostMapping("/reports")
 public String create(@RequestParam String category,@RequestParam String description,
  @RequestParam(required=false) Double latitude,@RequestParam(required=false) Double longitude,
  @RequestParam(required=false) MultipartFile photo,Authentication auth,RedirectAttributes ra){
  try{
   if(latitude==null || longitude==null || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180){ra.addFlashAttribute("error","Location is compulsory. Please share your current location before submitting.");return "redirect:/reports/new";}
   CommunityReport r=new CommunityReport();r.setCategory(category);r.setDescription(description.trim());r.setReporterEmail(auth.getName());
   if(latitude!=null&&longitude!=null&&latitude>=-90&&latitude<=90&&longitude>=-180&&longitude<=180){r.setLatitude(latitude);r.setLongitude(longitude);}
   if(photo!=null&&!photo.isEmpty()){
    String type=photo.getContentType()==null?"":photo.getContentType();
    if(!type.startsWith("image/")||photo.getSize()>8*1024*1024){ra.addFlashAttribute("error","Upload an image under 8 MB.");return "redirect:/reports/new";}
    String ext=type.equals("image/png")?".png":type.equals("image/webp")?".webp":".jpg";
    String name=java.util.UUID.randomUUID()+ext;Path dir=Paths.get(uploadDir);Files.createDirectories(dir);
    Files.copy(photo.getInputStream(),dir.resolve(name),StandardCopyOption.REPLACE_EXISTING);r.setImageName(name);
   }
   service.save(r);ra.addFlashAttribute("success","Report submitted successfully.");
  }catch(Exception e){ra.addFlashAttribute("error","Could not save report. Please try again.");}
  return "redirect:/reports";
 }
 @PostMapping("/admin/reports/{id}/status") public String update(@PathVariable Long id,@RequestParam String status,RedirectAttributes ra){
  if(!java.util.Set.of("SUBMITTED","UNDER_REVIEW","RESOLVED","REJECTED").contains(status))return "redirect:/admin";
  var r=service.get(id);r.setStatus(status);service.save(r);ra.addFlashAttribute("success","Report status updated.");return "redirect:/admin";
 }
}
