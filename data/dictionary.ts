export const dictionary = {
  pt: {
    nav: {
      name: "Rafael Ghiorzi",
      role: "Engenheiro de Software",

      hero: "Início",
      exp: "Carreira",
      projects: "Projetos",
      contact: "Contato",
    },

    hero: {
      title: "Desenvolvendo software para o mundo real",
      desc: "Focado em transformar teoria em sistemas robustos...",
    },

    projects: {
      title: "Projetos recentes",
      desc: "Tenho trabalhado nos seguintes projetos",
    },
    projectsData: [
      {
        title: "IpeaPub",
        desc: "Ferramenta de RAG que eu não vou explicar",
        tech: "TypeScript, PostgreSQL",
        img: "/pato.jpg",
      },
      {
        title: "Homelab",
        desc: "Repositório que armazena todas minhas coisas de homelab",
        tech: "TypeScript, PostgreSQL",
        img: "/img2.png",
      },
    ],

    experience: {
      title: "Experiência profissional",
      desc: "Veja por onde eu já passei",
    },
    expData: [
      {
        role: "Desenvolvedor",
        company: "Tech corp",
        time: "2024 - Presente",
        desc: "Descrição do trabalho",
        tech: "Typescript, PostgreSQL",
        img: "/img3.png",
      },
      {
        role: "Desenvolvedor",
        company: "Tech corp",
        time: "2024 - Presente",
        desc: "Descrição do trabalho",
        tech: "Typescript, PostgreSQL",
        img: "/img3.png",
      },
    ],

    contact: {
      title: "Contato",
      desc: "Eu nunca recusei uma boa música.",
      github: "teste",
      linkedin: "teste",
      email: "teste",
    },

    copyright: "© Copyright 2026 Rafael Ghiorzi. Todos os direitos reservados",
  },

  en: {
    nav: {
      name: "Rafael Ghiorzi",
      role: "Software Engineer",

      hero: "Home",
      exp: "About",
      projects: "Projects",
      contact: "Contact",
    },

    hero: {
      title: "Building software for the real world",
      desc: "Focused on turning theory into robust systems...",
    },

    projects: {
      title: "Recent projects",
      desc: "Here are some of the projects I've been working on",
    },
    projectsData: [
      {
        title: "IpeaPub",
        desc: "A RAG tool I won't bother explaining",
        tech: "TypeScript, PostgreSQL",
        img: "/img1.png",
      },
      {
        title: "Homelab",
        desc: "Repository that stores all my homelab stuff",
        tech: "TypeScript, PostgreSQL",
        img: "/img2.png",
      },
    ],

    experience: {
      title: "Professional experience",
      desc: "A look at where I've worked",
    },
    expData: [
      {
        role: "Developer",
        company: "Tech corp",
        time: "2024 - Present",
        desc: "Job description",
        tech: "Typescript, PostgreSQL",
        img: "/img3.png",
      },
      {
        role: "Developer",
        company: "Tech corp",
        time: "2024 - Present",
        desc: "Job description",
        tech: "Typescript, PostgreSQL",
        img: "/img3.png",
      },
    ],

    contact: {
      title: "Contact",
      desc: "I've never refused good music.",
      github: "",
      linkedin: "",
      email: "",
    },

    copyright: "© Copyright 2026 Rafael Ghiorzi. All Rights Reserved",
  },
};

export type Lang = "pt" | "en";
