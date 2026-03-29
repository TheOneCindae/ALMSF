function [matches, best_func_groups] = spectral_matcher(filtered_signal, db_references)
% Pattern Detection: Pearson + SAM computation
% Extracts peaks and evaluates against reference signatures.
    
    % Find peaks mapping (pseudo-implementation)
    [pks, locs] = findpeaks(filtered_signal);
    
    % SAM computation function
    spectral_angle = @(u, v) acos( dot(u, v) / (norm(u)*norm(v)) );
    
    matches = [];
    best_func_groups = {};
    
    for i = 1:length(db_references)
        ref_signal = db_references{i}.signal;
        
        % Normalize both
        filter_norm = filtered_signal / max(filtered_signal);
        ref_norm = ref_signal / max(ref_signal);
        
        % Length alignment simple heuristic
        L = min(length(filter_norm), length(ref_norm));
        
        p = corr(filter_norm(1:L)', ref_norm(1:L)', 'Type', 'Pearson');
        sam_score = 1 - (spectral_angle(filter_norm(1:L)', ref_norm(1:L)') / pi);
        
        combined_score = 0.5 * p + 0.5 * sam_score;
        matches(i).name = db_references{i}.name;
        matches(i).score = combined_score * 100;
        matches(i).cas = db_references{i}.cas;
    end
    
    % Sort Matches
    [~, idx] = sort([matches.score], 'descend');
    matches = matches(idx(1:min(3, length(idx))));
end
