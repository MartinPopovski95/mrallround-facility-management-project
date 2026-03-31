# Mr.Allround - Facility Management Website

> Professional facility management services website for a real Swiss client, built by team G6 at Avenga Academy.

**Live Demo:** [mrallround-facility-management-proj.vercel.app](https://mrallround-facility-management-proj.vercel.app/)

---

> **What's in this repo**
>
> This repository contains the **frontend only** (`client/` folder), deployed to Vercel.
> The backend - a **Strapi CMS** and an **ASP.NET Core 8 Web API** backed by **PostgreSQL** - is deployed separately and not included here for client confidentiality.
> The live demo above connects to those deployed services and serves real, dynamically fetched content.

---

## About the Project

**Mr.Allround** is a facility management company based in **Olten, Switzerland**, offering professional cleaning, maintenance, renovation, disposal, and relocation services.

This website was built as a **real-world client project** during the Avenga Academy program. The goal was to deliver a production-ready, multilingual, CMS-driven web application - from design system to API integration - without relying on any JavaScript framework.

The project gave us hands-on experience building across the full stack: integrating a headless CMS, consuming a custom REST API, handling i18n, and deploying a real product for a paying client.

---

## Team

Developed by the **G6 team** at Avenga Academy:

| Name | Role |
|---|---|
| Martin Popovski | Developer |
| Ivan Dimkovski | Developer |
| Sinisha Bogdanovski | Developer |

---

## Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Vanilla JS, no frontend framework |
| **UI Framework** | Bootstrap 5.3.3 | Responsive grid & components |
| **Styling** | Custom CSS + CSS Variables | Design tokens, dark mode, custom fonts |
| **CMS** | Strapi v5.23.1 | Headless CMS with REST API *(deployed, private)* |
| **Backend API** | ASP.NET Core 8.0 (.NET 8) | Business logic & calculators *(deployed, private)* |
| **Database** | PostgreSQL | Relational data persistence *(deployed, private)* |
| **i18n** | Custom translation system | English & German (EN/DE) |
| **Deployment** | Vercel | Frontend hosting |

---

## Features

- **Multi-language** - English and German (EN/DE), switchable at runtime via custom i18n system
- **Dark / Light mode** - User-toggled theme built with CSS custom properties
- **Service pricing calculators** - Area-based interactive calculators for each of the 5 services
- **CMS-driven content** - All page content managed via Strapi admin, fetched at runtime
- **Career portal** - Job listings and online application form with backend submission
- **Google Reviews widget** - Live testimonials pulled from Google
- **Image gallery** - Lightbox modal with keyboard navigation
- **Animated stats counters** - Scroll-triggered counters for company stats
- **Google Maps embed** - Office location in the contact section
- **Reusable service request form** - Shared component across all service pages
- **Responsive design** - Mobile-first, tested across breakpoints
- **Custom typography** - Artico Expanded font family with multiple weights

---

## Skills Demonstrated

This codebase is a good reference for the following patterns - built without any JS framework:

- **Vanilla JS module architecture** - each service page is split into `api.js`, `render.js`, `language.js`, and `main.js` modules
- **REST API integration** - async data fetching from both a headless CMS (Strapi) and a custom .NET API
- **i18n without a library** - `data-i18n` attribute-driven translation system with localStorage persistence
- **Dark mode with CSS variables** - full theming via `:root` custom properties, toggled by a single class
- **Dynamic pricing calculator** - area-based input drives live API calls and re-renders pricing tiers
- **Reusable component pattern** - shared navbar, footer, and form components loaded across all pages
- **Design token system** - spacing, color, typography, and radius scales defined in `css/base.css`
- **Environment-aware config** - `config.js` detects dev/staging/prod and switches API base URLs

---

## Pages

| Page | Description |
|---|---|
| Homepage | Hero, services overview, animated stats, gallery, Google reviews, contact map |
| About Us | Company history, values, and team |
| Career | Job listings and online application portal |
| Cleaning Services | Service details + area-based pricing calculator |
| Property Maintenance | Service details + area-based pricing calculator |
| Renovation Services | Service details + area-based pricing calculator |
| Disposal Services | Service details + area-based pricing calculator |
| Relocation Services | Service details + area-based pricing calculator |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│              Browser (Vercel · this repo)                │
│            HTML / CSS / Vanilla JavaScript               │
│   Bootstrap 5  │  Custom i18n  │  Dark/Light Mode        │
└──────────────┬───────────────────────────┬───────────────┘
               │  fetch()                  │  fetch()
               ▼                           ▼
┌──────────────────────┐     ┌─────────────────────────────┐
│     Strapi CMS       │     │   ASP.NET Core 8 Web API    │
│  (deployed · private)│     │    (deployed · private)     │
│                      │     │                             │
│  · Page content      │     │  · Service calculators      │
│  · Service info      │     │  · Pricing logic            │
│  · Career listings   │     │  · Form submissions         │
│  · Footer / Nav      │     │  · Career applications      │
│  · Site settings     │     │                             │
└──────────┬───────────┘     └────────────┬────────────────┘
           │                              │
           └──────────────┬───────────────┘
                          ▼
               ┌─────────────────────┐
               │     PostgreSQL      │
               │(deployed · private) │ 
               └─────────────────────┘
```

---


> The full project also includes a `cms/` (Strapi) and `server/` (ASP.NET Core) directory - these are not published here due to client confidentiality.

---

## Running the Frontend Locally

No build step is required.

To run the frontend locally, either:

- serve `client/index.html`, or
- open it with Live Server

> **Note:** Dynamically loaded content (service details, career listings, etc.) is fetched from the deployed backend. Running locally will display the full UI - dynamic sections depend on the live API being reachable.

---

## License & Usage

This project was developed exclusively for a **real client** as part of the Avenga Academy program.

**Commercial use** of this codebase is **not permitted** without explicit written permission from the client.

**Educational, demonstration, and portfolio** use is welcome - feel free to explore the code, learn from it, and reference it in your own portfolio.

> Built with care by the G6 team at Avenga Academy.
