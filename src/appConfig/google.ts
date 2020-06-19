
export function googlify(value:string) : string
{
    return "https://www.google.com/search?q=" + encodeURIComponent(value);
}
