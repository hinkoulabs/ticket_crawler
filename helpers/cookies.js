export const clearCookies = async (page) => {
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
};