package com.aliunal.todoservice.shared.enums;

public enum Priority {
    LOW("Niedrig"),
    MEDIUM("Mittel"), 
    HIGH("Hoch");
    
    private final String displayName;
    
    Priority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}