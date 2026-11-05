package com.earthpulse.ai.repository;
import com.earthpulse.ai.model.CommunityReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ReportRepository extends JpaRepository<CommunityReport,Long>{
 List<CommunityReport> findAllByOrderByCreatedAtDesc();
 List<CommunityReport> findByReporterEmailOrderByCreatedAtDesc(String email);
}
