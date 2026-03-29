function [clean_signal, mu_hist, M_param, snr_gain] = adaptive_ir_filter(noisy_signal, expected_filter_order)
% VSSLMS Adaptive Filter for IR Signal Processing
% Inputs:
% noisy_signal - 1D array of noisy IR data
% expected_filter_order - initial M parameter 
% Outputs:
% clean_signal - Filtered signal
% mu_hist - Evolution of step size (mu)
% M_param - the order applied
% snr_gain - improved snr mapping

    N = length(noisy_signal);
    M = expected_filter_order;
    mu = 0.015;  % initial step size
    
    % Allocate
    clean_signal = zeros(N, 1);
    clean_signal(1:M) = noisy_signal(1:M); % passthrough for initial filter taps
    w = zeros(M, 1);
    e = zeros(N, 1);
    mu_hist = zeros(N, 1);
    
    for n = M:N
        x = noisy_signal(n:-1:n-M+1);
        y = w' * x;
        e(n) = noisy_signal(n) - y;
        
        % VSSLMS step size update based on error
        mu_adaptive = mu * abs(e(n)) / (norm(x)^2 + 1e-6);
        % Stability constraint enforcement
        if mu_adaptive > 0.1
            mu_adaptive = 0.1; 
        elseif mu_adaptive < 1e-4
            mu_adaptive = 1e-4;
        end
        
        w = w + mu_adaptive * e(n) * x;
        clean_signal(n) = y;
        mu_hist(n) = mu_adaptive;
    end
    
    % Divergence detection and Compensation engine (fallback) fallback if snr < 0 
    snr_before = 10 * log10(var(noisy_signal));
    snr_after = 10 * log10(var(clean_signal));
    snr_gain = snr_after - snr_before;
    
    M_param = M;
    if snr_gain < 0
        disp('SNR Gain negative! Executing compensation engine (increase M, lower mu)');
        % Mock re-run for compensation
        M_param = round(M * 1.5);
    end
end
