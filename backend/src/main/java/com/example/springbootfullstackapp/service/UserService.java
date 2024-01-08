package com.example.springbootfullstackapp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springbootfullstackapp.model.User;
import com.example.springbootfullstackapp.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
