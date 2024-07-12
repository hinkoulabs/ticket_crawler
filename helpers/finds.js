export const findElementByText = (document, tag, text) => {
    const elements = Array.from(document.querySelectorAll(tag));
    return elements.find(a => a.textContent.trim() === text);
}