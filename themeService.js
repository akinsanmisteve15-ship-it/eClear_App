const eClearThemes = {
    // Every service now speaks the same monochrome language
    default: { 
        gradient: "linear-gradient(180deg, #000000 0%, #0A0A0A 100%)", 
        vibe: "#FFFFFF" 
    }
};

// Simplified lookup: return the same theme for everything
const getTheme = () => eClearThemes.default;