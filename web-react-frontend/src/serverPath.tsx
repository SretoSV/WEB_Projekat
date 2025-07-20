export function serverPath() {
        //let a = process.env.REACT_APP_SERVER_URL;
        //return a;
        return import.meta.env.VITE_API_URL;
}