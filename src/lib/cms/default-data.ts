import { cmsDataSchema } from "./schema";

const rawData = {
  version: "1.0.0",
  siteIdentity: {
    logo: {
      id: "logo-primary",
      type: "image",
      src: "/logo.svg",
      alt: "Monograma Emil Ciubotaru",
      width: 180,
      height: 64,
      lockupText: "Emil Ciubotaru",
      tagline: "Pictură & Artă Abstractă",
      orientation: "horizontal",
    },
    navigation: [
      {
        id: "nav-home",
        label: "Acasă",
        href: "/",
        description: "Pagina principală",
        isExternal: false,
        highlight: false,
        children: [],
      },
      {
        id: "nav-paintings",
        label: "Artă Pictură",
        href: "/painting-art",
        description: "Colecții pictură",
        isExternal: false,
        highlight: false,
        children: [
          { id: "nav-paintings-1", label: "Peisaj", href: "/painting-art?category=peisaj", isExternal: false, highlight: false, children: [] },
          { id: "nav-paintings-2", label: "Florale", href: "/painting-art?category=florale", isExternal: false, highlight: false, children: [] },
          { id: "nav-paintings-3", label: "Statică & Compoziții", href: "/painting-art?category=statica-compozitii", isExternal: false, highlight: false, children: [] },
        ],
      },
      {
        id: "nav-abstract",
        label: "Artă Abstractă",
        href: "/abstract-art",
        description: "Colecții abstracte",
        isExternal: false,
        highlight: false,
        children: [
          { id: "nav-abstract-1", label: "Impasto", href: "/abstract-art?category=impasto", isExternal: false, highlight: false, children: [] },
          { id: "nav-abstract-2", label: "Artă Fluidă", href: "/abstract-art?category=fluid-art", isExternal: false, highlight: false, children: [] },
        ],
      },
      {
        id: "nav-exhibitions",
        label: "Expoziții & Activități",
        href: "/exhibitions",
        description: "",
        isExternal: false,
        highlight: true,
        children: [],
      },
      {
        id: "nav-about",
        label: "Despre",
        href: "/about",
        description: "",
        isExternal: false,
        highlight: false,
        children: [],
      },
      {
        id: "nav-contact",
        label: "Contact",
        href: "/contact",
        description: "",
        isExternal: false,
        highlight: false,
        children: [],
      },
    ],
    socialLinks: [
      {
        id: "social-instagram",
        platform: "Instagram",
        label: "Instagram",
        url: "https://instagram.com/emil.ciubotaru",
        handle: "@emil.ciubotaru",
        isVisible: true,
      },
      {
        id: "social-facebook",
        platform: "Facebook",
        label: "Facebook",
        url: "https://facebook.com/emilciubotaruart",
        handle: "emilciubotaruart",
        isVisible: true,
      },
      {
        id: "social-youtube",
        platform: "YouTube",
        label: "YouTube",
        url: "https://youtube.com/@emilciubotaru",
        handle: "@emilciubotaru",
        isVisible: false,
      },
    ],
    contact: {
      headline: "Contactează atelierul",
      subheading: "Disponibil pentru comenzi, expoziții și colaborări",
      channels: [
        {
          id: "contact-email",
          type: "email",
          label: "Email",
          value: "atelier@emilciubotaru.com",
          note: "Răspund în 24h",
        },
        {
          id: "contact-phone",
          type: "phone",
          label: "Telefon",
          value: "+40 745 123 456",
          note: "Disponibil 10:00-18:00",
        },
        {
          id: "contact-studio",
          type: "location",
          label: "Studio",
          value: "Str. Grigore Vieru 12, Iași",
          note: "Vizite cu programare",
        },
      ],
      studioHours: [
        {
          id: "hours-week",
          label: "Luni - Vineri",
          value: "10:00 - 18:00",
        },
        {
          id: "hours-weekend",
          label: "Weekend",
          value: "Doar pe bază de programare",
        },
      ],
      mapEmbedUrl: "https://maps.google.com/?q=Iasi%2C+Romania",
    },
  },
  homepage: {
    hero: {
      id: "hero-home",
      eyebrow: "Painter Artist",
      title: "Emil Ciubotaru",
      description: "Pictez lumina, emoția și locurile care ne rămân în suflet.",
      ctaPrimary: { label: "Vezi galeria", href: "/painting-art" },
      ctaSecondary: { label: "Contact atelier", href: "/contact" },
      background: {
        id: "hero-background",
        type: "image",
        src: "/hero-banner.jpg",
        alt: "Hero banner",
      },
    },
    about: {
      headline: "About Emil Ciubotaru",
      summary: "Sunt Emil Ciubotaru, iar culoarea este felul în care respir. Transform emoțiile în povestiri pictate.",
      content: `Hei, bună,

Sunt Emil Ciubotaru, un artist, iar pentru mine culoarea este felul în care
respir. Îmi scriu gândurile în culori pe pânză, cu tușe dense, uneori blânde, alteori
neastâmpărate, ca și cum fiecare lucrare ar fi o mărturisire pe care n-am spus-o
niciodată cu voce tare.

Pictez florile care nu mor niciodată, anotimpurile care trec prin mine mai des
decât prin calendar și orașele în care lumina se prelinge pe clădiri ca o amintire
caldă. Uneori, las realitatea să vorbească. Alteori, o răsucesc, o tulbur, o
transform în abstracții care poartă urme de suflet și tăceri colorate.

Pensula și cuțitul de paletă sunt prelungirea mâinii mele. În urma lor rămân
straturi groase, reliefuri, vibrații, urme ale felului în care simt lumea. Fiecare
culoare pe care o așez este o poveste scurtă, iar fiecare lucrare este o întâmplare
trăită cândva, poate de mine, poate de tine.

Pictura este felul meu de a pune ordine în emoții și de a da formă lucrurilor
care nu se lasă rostite.

Dacă un tablou de-al meu te face să te oprești o clipă, să respiri altfel sau
să-ți amintești ceva ce credeai că ai pierdut, atunci arta mea și-a găsit drumul ei.`,
      image: {
        id: "about-hero-image",
        type: "image",
        src: "/portrait.jpg",
        alt: "Emil Ciubotaru"
      },
      blocks: [],
    },
    sections: [
      {
        id: "home-featured",
        title: "Lucrări selectate",
        description: "O selecție curatorială de piese recente.",
        type: "featured-art",
        layout: "grid",
        enabled: true,
        referenceIds: ["art-luminous-atrium", "art-carpathian-winter", "art-textures"],
        manualContent: "",
      },
      {
        id: "home-cta",
        title: "Comenzi personalizate",
        description: "Scrie-mi pentru piese dedicate sau colaborări vizuale.",
        type: "cta",
        layout: "split",
        enabled: true,
        referenceIds: [],
        manualContent: "atelier@emilciubotaru.com",
      },
      {
        id: "home-expos",
        title: "Expoziții & Activități",
        description: "Călătoria mea în galerii și spații publice.",
        type: "expositions",
        layout: "full",
        enabled: true,
        referenceIds: ["expo-lumini", "expo-galateea"],
        manualContent: "",
      },
    ],
  },
  artLibrary: {
    artworks: [
      {
        id: "art-luminous-atrium",
        slug: "peisaj-romanesc",
        title: "Atrium Luminous",
        summary: "Peisaj urban luminat de un apus cald.",
        collection: "Peisaje Urbane",
        category: "Pictură",
        style: "Figurativ",
        status: "published",
        visibility: "public",
        year: "2024",
        materials: ["ulei pe pânză", "foiță de aur"],
        palette: ["#edc04c", "#2c2c34", "#a3523a"],
        dimensions: { width: 80, height: 60, unit: "cm" },
        pricing: {
          amount: 2400,
          currency: "EUR",
          isAvailable: true,
          notes: "Cadru inclus",
        },
        heroImage: {
          id: "art-luminous-hero",
          type: "image",
          src: "/artwork-landscape-1.jpg",
          alt: "Atrium Luminous",
        },
        gallery: [
          {
            id: "art-luminous-g1",
            asset: {
              id: "art-luminous-hero",
              type: "image",
              src: "/artwork-landscape-1.jpg",
              alt: "Atrium Luminous",
            },
            caption: "Detaliu textură",
            isCover: true,
          },
          {
            id: "art-luminous-g2",
            asset: {
              id: "art-luminous-detail",
              type: "image",
              src: "/artwork-still-life-1.jpg",
              alt: "Detaliu Atrium",
            },
            caption: "Straturi aurii",
            isCover: false,
          },
        ],
        qrCode: {
          id: "qr-luminous",
          label: "QR Atrium Luminous",
          targetUrl: "https://emilciubotaru.com/art/peisaj-romanesc",
          includePrice: true,
          callToAction: "Scanează pentru detalii",
          printSize: "80mm",
        },
        related: {
          mode: "auto",
          autoTags: ["peisaj", "lumina"],
          manualIds: [],
        },
        seo: {
          title: "Atrium Luminous - Emil Ciubotaru",
          description: "Peisaj urban cu note aurii și lumină caldă.",
          keywords: ["peisaj", "pictură ulei", "emil ciubotaru"],
        },
      },
      {
        id: "art-carpathian-winter",
        slug: "iarna-in-carpati",
        title: "Iarnă în Carpați",
        summary: "Zăpada translucidă și umbre albastre.",
        collection: "Peisaje Montane",
        category: "Pictură",
        style: "Impresionism",
        status: "published",
        visibility: "public",
        year: "2023",
        materials: ["ulei pe pânză"],
        palette: ["#fcfdff", "#5a6b8c", "#1c2438"],
        dimensions: { width: 90, height: 70, unit: "cm" },
        pricing: {
          amount: 2600,
          currency: "EUR",
          isAvailable: false,
          notes: "Vândut \u2013 tiraj limitat disponibil",
        },
        heroImage: {
          id: "art-carpathian-hero",
          type: "image",
          src: "/artwork-winter-1.jpg",
          alt: "Iarnă în Carpați",
        },
        gallery: [
          {
            id: "art-carpathian-g1",
            asset: {
              id: "art-carpathian-hero",
              type: "image",
              src: "/artwork-winter-1.jpg",
              alt: "Iarnă în Carpați",
            },
            caption: "Vârfuri carpatice",
            isCover: true,
          },
        ],
        qrCode: {
          id: "qr-carpathian",
          label: "QR Iarnă în Carpați",
          targetUrl: "https://emilciubotaru.com/art/iarna-in-carpati",
          includePrice: false,
          callToAction: "Scanează pentru poveste",
          printSize: "80mm",
        },
        related: {
          mode: "manual",
          autoTags: [],
          manualIds: ["art-luminous-atrium"],
        },
        seo: {
          title: "Iarnă în Carpați - Emil Ciubotaru",
          description: "O interpretare atmosferică a munților iarna.",
          keywords: ["carpați", "iarna", "pictură peisaj"],
        },
      },
      {
        id: "art-textures",
        slug: "texturi-abstracte",
        title: "Texturi Abstracte",
        summary: "Compoziție vibrantă în straturi dense.",
        collection: "Explorări Abstracte",
        category: "Abstract",
        style: "Impasto",
        status: "draft",
        visibility: "private",
        year: "2024",
        materials: ["acrilic", "pigmenți", "paste structurale"],
        palette: ["#f37b4a", "#1e1e22", "#f2e5da"],
        dimensions: { width: 100, height: 100, unit: "cm" },
        heroImage: {
          id: "art-textures-hero",
          type: "image",
          src: "/artwork-impasto-1.jpg",
          alt: "Texturi abstracte",
        },
        gallery: [
          {
            id: "art-textures-g1",
            asset: {
              id: "art-textures-hero",
              type: "image",
              src: "/artwork-impasto-1.jpg",
              alt: "Texturi abstracte",
            },
            caption: "Structuri dinamice",
            isCover: true,
          },
        ],
        qrCode: {
          id: "qr-textures",
          label: "QR Texturi Abstracte",
          targetUrl: "https://emilciubotaru.com/art/texturi-abstracte",
          includePrice: false,
          callToAction: "Scanează pentru culise",
          printSize: "50mm",
        },
        related: {
          mode: "auto",
          autoTags: ["abstract", "impasto"],
          manualIds: [],
        },
        seo: {
          title: "Texturi Abstracte - Emil Ciubotaru",
          description: "Explorare impasto cu accente vibrante.",
          keywords: ["abstract", "impasto", "texturi"],
        },
      },
    ],
  },
  expositions: [
    {
      id: "expo-lumini",
      title: "Lumini Urbane",
      slug: "lumini-urbane",
      venue: "Galeria Centrală",
      location: "Iași, România",
      startDate: "2024-05-12",
      endDate: "2024-06-20",
      description: "Expoziție personală dedicată texturilor luminii în spațiul urban.",
      featuredArtworkIds: ["art-luminous-atrium", "art-textures"],
      heroImage: {
        id: "expo-lumini-hero",
        type: "image",
        src: "/artwork-landscape-1.jpg",
        alt: "Expoziția Lumini Urbane",
      },
      links: [
        {
          id: "expo-lumini-press",
          label: "Press kit",
          url: "https://example.com/press-kit",
        },
      ],
      status: "archived",
    },
    {
      id: "expo-galateea",
      title: "Materia și Liniștea",
      slug: "materia-linistea",
      venue: "Galateea Contemporary Art",
      location: "București, România",
      startDate: "2025-03-01",
      endDate: "2025-04-10",
      description: "Instalație mixtă care combină pictură și ceramică.",
      featuredArtworkIds: ["art-textures"],
      heroImage: {
        id: "expo-galateea-hero",
        type: "image",
        src: "/artwork-still-life-1.jpg",
        alt: "Materia și Liniștea",
      },
      links: [],
      status: "upcoming",
    },
  ],
};

export const defaultCmsData = cmsDataSchema.parse(rawData);
