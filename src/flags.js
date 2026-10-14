export const isOn = (name, env = process.env) => env[`FLAG_${name}`] === "1";
