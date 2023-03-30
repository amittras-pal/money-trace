import {
  IconApps,
  IconBasket,
  IconBook,
  IconCategory,
  IconChefHat,
  IconCoins,
  IconCookie,
  IconDeviceGamepad2,
  IconDroplet,
  IconFlame,
  IconGasStation,
  IconGift,
  IconGlassFull,
  IconHandSanitizer,
  IconHeadphones,
  IconHeartbeat,
  IconHomeBolt,
  IconHomeCog,
  IconHomeDollar,
  IconHotelService,
  IconParking,
  IconPaw,
  IconPingPong,
  IconRouter,
  IconStereoGlasses,
  IconTags,
  IconToolsKitchen2,
  IconTrain,
  IconTrash,
  IconUserShield,
  IconUserStar,
} from "@tabler/icons-react";

const CATEGORIES = [
  {
    title: "Entertainment",
    color: "yellow",
    subCategories: [
      {
        title: "Games",
        icon: IconDeviceGamepad2,
      },
      { title: "Movies", icon: IconStereoGlasses },
      { title: "Music", icon: IconHeadphones },
      { title: "Sports", icon: IconPingPong },
      { title: "Other", icon: IconCategory },
    ],
  },
  {
    title: "Food & Drinks",
    color: "green",
    subCategories: [
      { title: "Dining Out", icon: IconToolsKitchen2 },
      { title: "Groceries", icon: IconBasket },
      { title: "Liquor", icon: IconGlassFull },
      { title: "Snacks", icon: IconCookie },
      { title: "Other", icon: IconCategory },
    ],
  },
  {
    title: "House & Utilities",
    color: "grape",
    subCategories: [
      { title: "Household Supplies", icon: IconHandSanitizer },
      { title: "Maintenance & Services", icon: IconHomeCog },
      { title: "Rent/Mortgage", icon: IconHomeDollar },
      { title: "Electricity", icon: IconHomeBolt },
      { title: "Heat/Gas", icon: IconFlame },
      { title: "TV/Phone/Internet", icon: IconRouter },
      { title: "Trash", icon: IconTrash },
      { title: "Household Aid", icon: IconChefHat },
      { title: "Other", icon: IconCategory },
      { title: "Water", icon: IconDroplet },
    ],
  },
  {
    title: "Uncategorized",
    color: "gray",
    subCategories: [{ title: "General", icon: IconApps }],
  },
  {
    title: "Lifestyle",
    color: "red",
    subCategories: [
      { title: "Other", icon: IconCategory },
      { title: "Shopping", icon: IconTags },
      { title: "Gifts", icon: IconGift },
      { title: "Education", icon: IconBook },
      { title: "Investments", icon: IconCoins },
      { title: "Insurance", icon: IconUserShield },
      { title: "Pets", icon: IconPaw },
      { title: "Personal", icon: IconUserStar },
      { title: "Medical", icon: IconHeartbeat },
    ],
  },
  {
    title: "Travel/Transportation",
    color: "cyan",
    subCategories: [
      { title: "Other", icon: IconCategory },
      { title: "Public Transport", icon: IconTrain },
      { title: "Fuel", icon: IconGasStation },
      { title: "Hotel", icon: IconHotelService },
      { title: "Parking", icon: IconParking },
    ],
  },
];

export function getColor(cat) {
  return CATEGORIES.find((c) => c.title === cat).color;
}

export function getIcons(category, sub) {
  return CATEGORIES.find((c) => c.title === category)
    .subCategories.filter((i) => sub.includes(i.title))
    .map((i) => ({ Icon: i.icon, label: i.title }));
}

export function getParents() {
  return CATEGORIES.map((c) => ({
    label: c.title,
    value: c.title,
    color: c.color,
  })).sort((a, b) => a.label.localeCompare(b.label));
}

export function getChildren(parent) {
  if (!parent) return [];
  const cat = CATEGORIES.find((c) => c.title === parent);
  return cat.subCategories.map((c) => ({
    ...c,
    color: cat.color,
    label: c.title,
    value: c.title,
  }));
}

export function getCategories() {
  return CATEGORIES.flatMap((c) =>
    c.subCategories.map((sc) => ({
      label: sc.title,
      value: `${c.title}:${sc.title}`,
      group: c.title,
    }))
  );
}
