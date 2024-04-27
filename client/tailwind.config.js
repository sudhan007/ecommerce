import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // login auth colors
        authtop: "#1A3824",
        authmaintext: "#1D772D",
        authsubtext: "#3E334E",
        authlogotext: "#EDEDED",
        btncolor: "#1D772D",
        inputborder: "#9FC2B1",
        fff: "#FFFFFF",
        // login auth colors

        // homepage  colors

        // footer colors:
        footbg: "#1A3824",
        foottext: "#808080",
        footlogo: "#EDEDED",
        footheading: "#FFFFFF",
        footborder: "#20B526",
        // navbar colors:
        navlogo: "#EDEDED",
        navsearch: "#B4E34F",
        offer: "#9AE46C",
        fresh: "#1A3824",

        //categories colors
        heading: "#253D4E",
        veg: "#FFF3FF",
        fruits: "#F2FCE4",
        spices: "#FEEFEA",
        groceries: "#ECFFEC",
        milk: "#FFFCEB",
        meat: "#DEF9EC",
        count: "#ADADAD",

        //products colors

        prodheading: "#253D4E",
        prodactive: "#0EA829",
        prodname: "#025029",
        prodorginalprice: "#B8B8B8",
        prodkg: "#134700",
        prodback: "#F9F8F8",
        proddropdown: "#0EA829",
        prodround: "#FFFFFF",

        // offers colors
        offerheading1: "#253D4E",
        offercardbg1: "#FFF5E1",
        freedelivery1: "#FFB21A",
        offerdescription1: "#838383",
        shopnow1: "#0EA829",

        offerheading2: "#FFFFFF",
        offercardbg2: "#092531",
        freedelivery2: "#28CA7C",
        offerdescription2: "#F5F5F5",
        shopnow2: "#FFFFFF",
        shopbtn2: " #008C49",

        // shop cart drawer colors
        closeicon: "#1A1A1A",
        productquantiy: "#808080",
        prodcloseicon: "#666666",
        checkbtn: "#0EA829",
        gotocart: "#56AC59",

        //  homepage  colors
        // user account settings colors
        "bacto": "#00B207",
        "label": "#1A1A1A",
        "formtext": "#666666",

      },
    },

    fontFamily: {
      "duplet-reg": "duplet-regular",
      "duplet-semi": "duplet-semibold",
      "inter": "'Inter', sans-serif",
      "poppins": "'Poppins', sans-serif",
    },
  },
  plugins: [nextui()],
};
