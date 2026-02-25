export const debounce = (func, delay = 500) => {
    let timer;

    return async (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
};