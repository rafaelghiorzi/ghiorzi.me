export const dictionary = {
    pt: {
        nav: {
            name: "Rafael Ghiorzi",
            role: "Desenvolvedor Backend",
            hero: "Início",
            exp: "Experiência",
            projects: "Projetos",
            contact: "Contato",
        },

        hero: {
            title: "Construindo sistemas para o mundo real",
            desc: "Estudante de Ciência da Computação com foco em infraestrutura, backend e engenharia de sistemas.",
        },

        introduction: {
            title: "Olá! Eu sou Rafael Ghiorzi",
            desc: "Sou estudante de Ciência da Computação na Universidade de Brasília, com grande interesse em infraestrutura, sistemas distribuídos e engenharia backend. Gosto de entender como os sistemas se comportam em cenários reais — desde o desenvolvimento da aplicação até o ambiente onde ela é executada.\n\nAlém da tecnologia, tenho uma forte conexão com música e artes em geral. Toco bateria há vários anos, o que influenciou minha forma de pensar sobre disciplina, criatividade e prática contínua — aspectos que levo naturalmente para o meu trabalho como desenvolvedor.",
        },

        projects: {
            title: "Alguns projetos que eu já participei",
            desc: "Alguns dos projetos que desenvolvi e venho explorando.",
        },

        projectsData: [
            {
                title: "PdfPlucker",
                desc: "Ferramenta de processamento de PDFs voltada para cargas em lote, com extração de dados estruturados (texto, tabelas e imagens), suportando execução paralela e aceleração por GPU.",
                tech: "Python, CUDA, PyTorch, CLI",
                img: "/plucker.png",
                link: "https://github.com/rafaelghiorzi/pdfplucker",
            },
            {
                title: "Homelab Cookbook",
                desc: "Infraestrutura pessoal self-hosted onde experimento com redes, conteinerização, automação e configuração de sistemas em um ambiente controlado.",
                tech: "Docker, Linux, Redes, GitHub Actions",
                img: "",
                link: "https://github.com/rafaelghiorzi/homelab-infra",
            },
            {
                title: "Extração de Nomes – DOE São Paulo",
                desc: "Projeto de pesquisa focado na extração de dados estruturados a partir de documentos históricos, utilizando visão computacional, OCR e modelos de linguagem.",
                tech: "Python, YOLO, DocumentAI, LLMs",
                img: "",
                link: "",
            },
            {
                title: "RAG Publications",
                desc: "Sistema baseado em RAG para consulta de dados públicos, projetado para lidar com dados estruturados e não estruturados, incluindo tabelas e imagens.",
                tech: "Python, HuggingFace, Qdrant, Docker",
                img: "/ipeapub.png",
                link: "https://github.com/rafaelghiorzi/IpeaPub",
            },
            {
                title: "Sistema de Gestão de Membros (FGM)",
                desc: "Aplicação web desenvolvida para automatizar processos internos de uma empresa júnior, melhorando a organização e reduzindo trabalho manual.",
                tech: "Next.js, NestJS, PostgreSQL",
                img: "",
                link: "",
            },
        ],

        experience: {
            title: "Experiência",
            desc: "Por onde eu já passei.",
        },

        expData: [
            {
                role: "Pesquisador em Ciência de Dados",
                company:
                    "Instituto de Pesquisa Econômica Aplicada (IpeaData-Lab)",
                time: "Fev. 2025 - Dez. 2025",
                desc: "Atuação no desenvolvimento de pipelines de processamento de dados para transformar relatórios em datasets estruturados. Contribuição em projetos envolvendo arquiteturas RAG e pipelines de extração em múltiplas etapas.",
                tech: "Python, RAG, Docker, Processamento de Dados",
            },
            {
                role: "Desenvolvedor de Software & Líder de Equipe",
                company: "Empresa Júnior de Computação – CJR",
                time: "Out. 2023 - Fev. 2025",
                desc: "Desenvolvimento de aplicações full-stack e liderança de equipes utilizando Scrum. Participação na construção de um sistema interno para automação de processos e melhoria da eficiência operacional.",
                tech: "Next.js, NestJS, PostgreSQL",
            },
        ],

        contact: {
            title: "Contato",
            desc: "Fique à vontade para entrar em contato!",
            github: "https://github.com/rafaelghiorzi",
            linkedin: "https://linkedin.com/in/rafaeldghiorzi",
            cv: "https://looking.cv/rafaeldghiorzi",
        },

        copyright: "© 2026 Rafael Ghiorzi. Todos os direitos reservados",
    },
    en: {
        nav: {
            name: "Rafael Ghiorzi",
            role: "Backend Developer",
            hero: "Home",
            exp: "Experience",
            projects: "Projects",
            contact: "Contact",
        },

        hero: {
            title: "Building systems for the real world",
            desc: "Computer Science student focused on infrastructure, backend systems, and practical engineering.",
        },

        introduction: {
            title: "Hi, I'm Rafael Ghiorzi",
            desc: "I'm a Computer Science student at the University of Brasília with a strong interest in infrastructure, distributed systems, and backend engineering. I enjoy understanding how systems behave in real-world conditions — from writing application code to setting up and operating the environments they run in.\n\nOutside of tech, I'm deeply connected to music and the arts. I've been playing drums for several years, which has shaped how I think about discipline, creativity, and long-term practice — skills I naturally bring into my work as a developer.",
        },

        projects: {
            title: "Some projects I've worked on",
            desc: "Some of the things I've built and have been experimenting with.",
        },

        projectsData: [
            {
                title: "PdfPlucker",
                desc: "PDF processing tool designed for batch workloads, extracting structured data such as text, tables, and images with support for parallel execution and GPU acceleration.",
                tech: "Python, CUDA, PyTorch, CLI",
                img: "/plucker.png",
                link: "https://github.com/rafaelghiorzi/pdfplucker",
            },
            {
                title: "Homelab Cookbook",
                desc: "Personal self-hosted infrastructure where I experiment with networking, containerization, automation, and system configuration in a controlled environment.",
                tech: "Docker, Linux, Networking, GitHub Actions",
                img: "",
                link: "https://github.com/rafaelghiorzi/homelab-infra",
            },
            {
                title: "Name Extraction – DOE São Paulo",
                desc: "Research project focused on extracting structured data from historical documents using a combination of computer vision, OCR, and language models.",
                tech: "Python, YOLO, DocumentAI, LLMs",
                img: "",
                link: "",
            },
            {
                title: "RAG Publications",
                desc: "Retrieval-augmented system for querying public datasets, designed to handle structured and unstructured data including tables and images.",
                tech: "Python, HuggingFace, Qdrant, Docker",
                img: "/ipeapub.png",
                link: "https://github.com/rafaelghiorzi/IpeaPub",
            },
            {
                title: "Member Management Platform (FGM)",
                desc: "Web application built to automate internal processes for a junior enterprise, improving organization and reducing manual work.",
                tech: "Next.js, NestJS, PostgreSQL",
                img: "",
                link: "",
            },
        ],

        experience: {
            title: "Experience",
            desc: "A look at where I've worked.",
        },

        expData: [
            {
                role: "Data Science Researcher",
                company:
                    "Institute for Applied Economic Research (IpeaData-Lab)",
                time: "Feb. 2025 - Dec. 2025",
                desc: "Worked on data processing pipelines and systems for transforming reports into structured datasets. Contributed to projects involving RAG architectures and multi-stage extraction pipelines.",
                tech: "Python, RAG, Docker, Data Processing",
            },
            {
                role: "Software Developer & Team Lead",
                company: "Junior Computing Enterprise – CJR",
                time: "Oct. 2023 - Feb. 2025",
                desc: "Developed full-stack applications and led small teams using Scrum. Helped build an internal system to automate workflows and improve operational efficiency.",
                tech: "Next.js, NestJS, PostgreSQL",
            },
        ],

        contact: {
            title: "Contact",
            desc: "Feel free to reach out!",
            github: "https://github.com/rafaelghiorzi",
            linkedin: "https://linkedin.com/in/rafaeldghiorzi",
            cv: "https://looking.cv/rafaeldghiorzi",
        },

        copyright: "© 2026 Rafael Ghiorzi. All rights reserved",
    },
};

export type Lang = "pt" | "en";
