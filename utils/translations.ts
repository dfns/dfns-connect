enum Locales {
  en = 'en',
  fr = 'fr',
}

export const T = {
  input_warning_mandatory: {
    [Locales.en]: 'This is mandatory.',
    [Locales.fr]: 'Ce champ est obligatoire.',
  },
  input_warning_date_invalid: {
    [Locales.en]: 'This date is not valid.',
    [Locales.fr]: "Cette date n'est pas valide.",
  },
  input_warning_date_future: {
    [Locales.en]: 'This date is in the future.',
    [Locales.fr]: 'Cette date est dans le futur.',
  },
  input_warning_date_past: {
    [Locales.en]: 'This date is in the past.',
    [Locales.fr]: 'Cette date est dans le passé.',
  },
  input_warning_date_old: {
    [Locales.en]: 'This date seems really old.',
    [Locales.fr]: 'Cette date semble très vieille.',
  },
  menu_item_home: {
    [Locales.en]: 'Home',
    [Locales.fr]: 'Accueil',
  },
}
