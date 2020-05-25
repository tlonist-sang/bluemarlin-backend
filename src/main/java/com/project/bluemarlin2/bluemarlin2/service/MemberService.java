package com.project.bluemarlin2.bluemarlin2.service;

import com.project.bluemarlin2.bluemarlin2.domain.Member;
import com.project.bluemarlin2.bluemarlin2.domain.MemberAccount;
import com.project.bluemarlin2.bluemarlin2.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService implements UserDetailsService {
    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Optional<Member> byUserId = memberRepository.findByUserId(userName);
        if(byUserId == null){

        }
        return new MemberAccount(byUserId.get());
    }

    public Member createNew(Member member){
        return this.memberRepository.encodeAndSave(member);
    }

    @Transactional
    public Member increaseRefreshTokenVersion(String userId){
        Optional<Member> byUserId = memberRepository.findByUserId(userId);
        assert(byUserId.isPresent());

        Member member = byUserId.get();
        member.setRefreshTokenVersion(member.getRefreshTokenVersion() + 1);
        Member saved = memberRepository.save(member);
        return saved;
    }
}
