package com.earthpulse.ai.repository;

import com.earthpulse.ai.model.LoginEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoginEventRepository extends JpaRepository<LoginEvent, Long> {

    List<LoginEvent> findTop30ByOrderByLoggedInAtDesc();

    List<LoginEvent> findTop30ByRoleOrderByLoggedInAtDesc(String role);
}
