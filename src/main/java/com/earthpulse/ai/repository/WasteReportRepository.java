
package com.earthpulse.ai.repository;

import com.earthpulse.ai.model.WasteReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WasteReportRepository
        extends JpaRepository<WasteReport, Long> {

    List<WasteReport> findAllByOrderByCreatedAtDesc();
}
