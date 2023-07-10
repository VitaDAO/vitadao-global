module.exports = {
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindAttributes: ["activeClassName"],
  tailwindFunctions: ["clsx", "cn", "cva"],
};
