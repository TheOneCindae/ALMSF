function noise_type = noise_classifier(noisy_signal)
% Noise Classification using Preprocessing FFT and priority logic
% Classes: [Non-stationary, Detector, Environmental, Thermal, Electronic]

    N = length(noisy_signal);
    % FFT computation
    Y = fft(noisy_signal);
    P2 = abs(Y/N);
    P1 = P2(1:N/2+1);
    P1(2:end-1) = 2*P1(2:end-1);
    
    % Basic priority-based decision logic
    avg_power = mean(P1);
    max_power = max(P1);
    
    if max_power > 10 * avg_power
        noise_type = 'Detector'; % High peak anomalies
    elseif var(noisy_signal(1:100)) > 5 * var(noisy_signal(end-100:end))
        noise_type = 'Non-stationary'; % Variance shifts
    elseif mean(noisy_signal) > 0.1
        noise_type = 'Environmental';
    elseif var(noisy_signal) < 0.05
        noise_type = 'Thermal'; % low uniform variance
    else
        noise_type = 'Electronic'; % default fallback
    end
end
