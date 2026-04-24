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
        title: "PdfPlucker",
        desc: "Wrapper poderoso para a biblioteca Docling focado em processamento em lote de PDFs. Extrai texto, tabelas e imagens com suporte a aceleração por hardware (CUDA).",
        tech: "Python, Docling, PyTorch, CUDA, CLI",
        img: "/plucker.png",
        link: "https://github.com/rafaelghiorzi/pdfplucker",
      },
      {
        title: "Homelab Infra Skeleton",
        desc: "Infraestrutura autohospedada gerenciada via Docker Compose e GitHub Actions. Inclui túneis Cloudflare para acesso seguro e stack LGTM para observabilidade completa.",
        tech: "Docker, GitHub Actions, Cloudflare, Grafana, Prometheus",
        img: "",
        link: "https://github.com/rafaelghiorzi/homelab-infra",
      },
      {
        title: "Competitive Programming",
        desc: "Coleção de algoritmos e resoluções de problemas complexos desenvolvidos para a disciplina de Programação Competitiva na UnB.",
        tech: "C++, Estruturas de Dados, Algoritmos",
        img: "",
        link: "https://github.com/rafaelghiorzi/Competitive-Programming",
      },
      {
        title: "RAG Publicações",
        desc: "Sistema RAG para busca e resposta em repositório público de conhecimento, com suporte nativo a tabelas, gráficos e imagens.",
        tech: "Python, HuggingFace, Agno, Qdrant, Docker",
        img: "/ipeapub.png",
        link: "https://github.com/rafaelghiorzi/IpeaPub",
      },
      {
        title: "Extração de Nomes DOE São Paulo",
        desc: "Pipeline híbrido (Visão Computacional + OCR + LLMs) para extração estruturada de dados a partir de documentos oficiais históricos.",
        tech: "Python, YOLO, Google DocumentAI, OpenAI",
        img: "",
        link: "",
      },
      {
        title: "Foca na Gestão do Membro (FGM)",
        desc: "Portal web completo para a gestão automatizada de processos internos de membros da empresa júnior.",
        tech: "Next.js, TailwindCSS, NestJS, PostgreSQL, AWS",
        img: "",
        link: "",
      },
    ],
    experience: {
      title: "Experiência profissional",
      desc: "Veja por onde eu já passei",
    },
    expData: [
      {
        role: "Cientista de Dados Pesquisador",
        company: "Instituto de Pesquisa Econômica Aplicada (IpeaData-Lab)",
        time: "Fev. 2025 - Dez. 2025",
        desc: "Desenvolvi o PdfPlucker, um pacote Python para transformar relatórios complexos em dados AI-ready, além de construir sistemas de agentes inteligentes com RAG.",
        tech: "Python, Machine Learning, RAG, Docling, Docker",
      },
      {
        role: "Gerente e Desenvolvedor",
        company: "Empresa Júnior de Computação – CJR",
        time: "Out. 2023 - Fev. 2025",
        desc: "Liderei equipes utilizando Scrum e desenvolvi aplicações web com Next.js, NestJS e PostgreSQL, além de automatizar rotinas organizacionais.",
        tech: "Next.js, NestJS, PostgreSQL, Scrum",
      },
    ],
    contact: {
      title: "Contato",
      desc: "Vamos compartilhar ideias!",
      github: "https://github.com/rafaelghiorzi",
      linkedin: "https://linkedin.com/in/rafaeldghiorzi",
      cv: "https://looking.cv/rafaeldghiorzi",
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
        title: "PdfPlucker",
        desc: "A powerful wrapper for the Docling library designed for batch processing PDFs. Extracts text, tables, and images with hardware acceleration support (CUDA).",
        tech: "Python, Docling, PyTorch, CUDA, CLI",
        img: "/plucker.png",
        link: "https://github.com/rafaelghiorzi/pdfplucker",
      },
      {
        title: "Homelab Infra Skeleton",
        desc: "Self-hosted infrastructure managed via Docker Compose and GitHub Actions. Features Cloudflare Tunnels for secure access and LGTM stack for full observability.",
        tech: "Docker, GitHub Actions, Cloudflare, Grafana, Prometheus",
        img: "",
        link: "https://github.com/rafaelghiorzi/homelab-infra",
      },
      {
        title: "Competitive Programming",
        desc: "A collection of complex algorithms and problem-solving solutions developed for the Competitive Programming course at UnB.",
        tech: "C++, Data Structures, Algorithms",
        img: "",
        link: "https://github.com/rafaelghiorzi/Competitive-Programming",
      },
      {
        title: "RAG Publications",
        desc: "RAG system for search and response in a public knowledge repository, with native support for tables, charts, and images.",
        tech: "Python, HuggingFace, Agno, Qdrant, Docker",
        img: "/ipeapub.png",
        link: "https://github.com/rafaelghiorzi/IpeaPub",
      },
      {
        title: "Name Extraction DOE São Paulo",
        desc: "Hybrid pipeline (Computer Vision + OCR + LLMs) for structured data extraction from historical official documents.",
        tech: "Python, YOLO, Google DocumentAI, OpenAI",
        img: "",
        link: "",
      },
      {
        title: "Member Management Focus (FGM)",
        desc: "Complete web portal for the automated management of internal processes for junior enterprise members.",
        tech: "Next.js, TailwindCSS, NestJS, PostgreSQL, AWS",
        img: "",
        link: "",
      },
    ],
    experience: {
      title: "Professional experience",
      desc: "A look at where I've worked",
    },
    expData: [
      {
        role: "Data Scientist Researcher",
        company: "Institute for Applied Economic Research (IpeaData-Lab)",
        time: "Feb. 2025 - Dec. 2025",
        desc: "Developed PdfPlucker, a Python package to transform complex reports into AI-ready data, and built intelligent agent systems using RAG architectures.",
        tech: "Python, Machine Learning, RAG, Docling, Docker",
      },
      {
        role: "Software Developer and Manager",
        company: "Junior Computing Enterprise – CJR",
        time: "Oct. 2023 - Feb. 2025",
        desc: "Led Scrum teams and developed web applications using Next.js, NestJS, and PostgreSQL, while automating internal routines.",
        tech: "Next.js, NestJS, PostgreSQL, Scrum",
      },
    ],
    contact: {
      title: "Contact",
      desc: "Let's share ideas!",
      github: "https://github.com/rafaelghiorzi",
      linkedin: "https://linkedin.com/in/rafaeldghiorzi",
      cv: "https://looking.cv/rafaeldghiorzi",
    },
    copyright: "© Copyright 2026 Rafael Ghiorzi. All Rights Reserved",
  },
};

export type Lang = "pt" | "en";
