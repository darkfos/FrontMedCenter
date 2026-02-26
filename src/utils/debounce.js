export const debounce = (func, delay = 500) => {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        console.log(1, delay)
        timer = setTimeout(() => {
            console.log(2)
            func.apply(this, args);
        }, delay);
    }
};