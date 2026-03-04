const Key = 'auth_token';
export const authStorage = {
    getToken(){
        return localStorage.getItem(Key);
    },
    setToken(token){
        localStorage.setItem(Key, token);
    },
    clearToken(){
        localStorage.removeItem(Key);
    }
}