export const renderTemplate = (text: string): string => {
  if (!text) return "";
  let converted_template = text.replace(/</g, "<").replace(/</g, "<");
  converted_template = converted_template
    .replace(/\*\*(.*?)\*\*/, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  return converted_template.split('<br>')
    .map(line => line.trim() ? `<p> ${line}</p>` : '')
    .join('');
}