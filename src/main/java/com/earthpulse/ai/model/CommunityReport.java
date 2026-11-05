package com.earthpulse.ai.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="community_reports")
public class CommunityReport {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=1000) private String description;
 @Column(nullable=false) private String category;
 @Column(nullable=false) private String status="SUBMITTED";
 private String imageName; private Double latitude; private Double longitude;
 @Column(nullable=false) private String reporterEmail;
 private LocalDateTime createdAt=LocalDateTime.now();
 public Long getId(){return id;} public String getDescription(){return description;} public void setDescription(String v){description=v;}
 public String getCategory(){return category;} public void setCategory(String v){category=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public String getImageName(){return imageName;} public void setImageName(String v){imageName=v;}
 public Double getLatitude(){return latitude;} public void setLatitude(Double v){latitude=v;}
 public Double getLongitude(){return longitude;} public void setLongitude(Double v){longitude=v;}
 public String getReporterEmail(){return reporterEmail;} public void setReporterEmail(String v){reporterEmail=v;}
 public LocalDateTime getCreatedAt(){return createdAt;}
}
