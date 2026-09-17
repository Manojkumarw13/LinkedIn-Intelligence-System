// Merger Logic for n8n
// This code combines all incoming items (CSV rows & GitHub repos) into a single text string.

let fullText = "";
const items = $input.all();
const MAX_ROWS = 5000;

// Track statistics
const stats = {
  GitHub: 0,
  Positions: 0,
  Connections: 0,
  Skills: 0,
  Education: 0,
  Profile: 0,
  Unknown: 0
};

if (items.length > 0) {
  for (let i = 0; i < items.length && i < MAX_ROWS; i++) {
    const row = items[i].json;
    let sectionHeader = "";
    
    // Identify source type
    if (row.html_url && row.full_name) {
       stats.GitHub++;
       sectionHeader = "GITHUB_REPO";
    } else if (row['Company Name'] !== undefined) {
       stats.Positions++;
       sectionHeader = "POSITION";
    } else if (row['First Name'] !== undefined && row['Connected On'] !== undefined) {
       stats.Connections++;
       sectionHeader = "CONNECTION";
    } else if (row['Skill Name'] !== undefined) {
       stats.Skills++;
       sectionHeader = "SKILL";
    } else if (row['School Name'] !== undefined) {
       stats.Education++;
       sectionHeader = "EDUCATION";
    } else if (row['Headline'] !== undefined || row['Summary'] !== undefined) {
       stats.Profile++;
       sectionHeader = "PROFILE";
    } else {
       stats.Unknown++;
       sectionHeader = "UNKNOWN_DATA";
    }

    const rowString = Object.entries(row)
      .filter(([key, value]) => value !== '' && value !== null)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ');
      
    if (rowString.length > 0) {
      fullText += `[${sectionHeader}] ${rowString}\n`;
    }
  }

  // Prepend summary
  let summary = "### INPUT DATA SUMMARY:\n";
  for (const [key, count] of Object.entries(stats)) {
    if (count > 0) summary += `- ${key}: ${count} rows\n`;
  }
  summary += "\n### RAW DATA START:\n";
  fullText = summary + fullText;

} else {
  fullText = "No data found in the processed CSV files.";
}

return [{
  json: {
    text_context: fullText
  }
}];
