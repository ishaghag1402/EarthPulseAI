package com.earthpulse.ai.controller;

import com.earthpulse.ai.controller.AuthController.Registration;
import com.earthpulse.ai.repository.UserRepository;
import com.earthpulse.ai.repository.WasteReportRepository;
import com.earthpulse.ai.repository.LoginEventRepository;
import com.earthpulse.ai.service.ReportService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class PageController {
    private final ReportService reports;
    private final UserRepository users;
    private final WasteReportRepository wasteReports;
    private final LoginEventRepository loginEvents;

    public PageController(ReportService reports, UserRepository users,
                          WasteReportRepository wasteReports, LoginEventRepository loginEvents) {
        this.reports = reports; this.users = users; this.wasteReports = wasteReports;
        this.loginEvents = loginEvents;
    }

    @GetMapping("/") public String home() { return "home"; }
    @GetMapping("/register") public String register(Model model) { model.addAttribute("form", new Registration()); return "register"; }
    @GetMapping("/login") public String login() { return "login"; }

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        var user = users.findByEmail(authentication.getName()).orElseThrow();
        var mine = reports.mine(authentication.getName());
        model.addAttribute("user", user); model.addAttribute("reports", mine);
        model.addAttribute("reportCount", mine.size());
        return "dashboard";
    }

    @GetMapping("/twin") public String twin() { return "twin"; }
    @GetMapping("/satellite") public String satellite() { return "satellite"; }
    @GetMapping("/assistant") public String assistant() { return "assistant"; }
    @GetMapping("/simulator") public String simulator() { return "simulator"; }
    @GetMapping("/reports/new") public String newReport() { return "report-form"; }
    @GetMapping("/your-activity") public String yourActivity() { return "redirect:/reports"; }
    @GetMapping("/reports") public String myReports(Authentication authentication, Model model) {
        model.addAttribute("reports", reports.mine(authentication.getName())); return "reports";
    }

    @GetMapping("/admin")
    public String admin(Authentication authentication, Model model) {
        if (authentication == null || !authentication.isAuthenticated()) return "redirect:/admin/login";
        var community = reports.all();
        var waste = wasteReports.findAllByOrderByCreatedAtDesc();
        var userList = users.findAll().stream().filter(u -> "USER".equalsIgnoreCase(u.getRole())).toList();
        model.addAttribute("adminName", authentication.getName());
        model.addAttribute("reports", community);
        model.addAttribute("wasteReports", waste);
        model.addAttribute("users", userList);
        model.addAttribute("loginEvents", loginEvents.findTop30ByRoleOrderByLoggedInAtDesc("USER"));
        model.addAttribute("userCount", userList.size());
        model.addAttribute("communityReportCount", community.size());
        model.addAttribute("wasteReportCount", waste.size());
        model.addAttribute("pendingCommunityCount", community.stream().filter(r -> "SUBMITTED".equalsIgnoreCase(r.getStatus()) || "UNDER_REVIEW".equalsIgnoreCase(r.getStatus())).count());
        model.addAttribute("pendingWasteCount", waste.stream().filter(r -> "Pending".equalsIgnoreCase(r.getStatus()) || "Under Review".equalsIgnoreCase(r.getStatus())).count());
        return "admin";
    }

    @PostMapping("/admin/waste-reports/{id}/status")
    public String updateWasteStatus(@PathVariable Long id, @RequestParam String status, RedirectAttributes redirect) {
        if (!java.util.Set.of("Pending", "Under Review", "Resolved", "Rejected").contains(status)) {
            redirect.addFlashAttribute("error", "Invalid WasteWatch status."); return "redirect:/admin#alerts";
        }
        wasteReports.findById(id).ifPresent(report -> { report.setStatus(status); wasteReports.save(report); });
        redirect.addFlashAttribute("success", "WasteWatch status updated."); return "redirect:/admin#alerts";
    }

    @PostMapping("/admin/community-reports/{id}/delete")
    public String deleteCommunityReport(@PathVariable Long id, RedirectAttributes redirect) {
        reports.delete(id);
        redirect.addFlashAttribute("success", "Community report deleted.");
        return "redirect:/admin#community";
    }

    @PostMapping("/admin/waste-reports/{id}/delete")
    public String deleteWasteReport(@PathVariable Long id, RedirectAttributes redirect) {
        wasteReports.deleteById(id);
        redirect.addFlashAttribute("success", "WasteWatch report deleted.");
        return "redirect:/admin#wastewatch";
    }
}
