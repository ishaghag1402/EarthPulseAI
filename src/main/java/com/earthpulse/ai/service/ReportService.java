package com.earthpulse.ai.service;
import com.earthpulse.ai.model.CommunityReport;
import com.earthpulse.ai.repository.ReportRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ReportService{
 private final ReportRepository repo;
 public ReportService(ReportRepository r){repo=r;}
 public List<CommunityReport> all(){return repo.findAllByOrderByCreatedAtDesc();}
 public List<CommunityReport> mine(String email){return repo.findByReporterEmailOrderByCreatedAtDesc(email);}
 public CommunityReport save(CommunityReport r){return repo.save(r);}
 public CommunityReport get(Long id){return repo.findById(id).orElseThrow();}
 public long count(){return repo.count();}
 public void delete(Long id){repo.deleteById(id);}
}
