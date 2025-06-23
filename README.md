# ClientVueDemoUX

A Vue 3 frontend application for managing client records and associated phone numbers. This project is part of a full-stack system that includes a separate backend API for data access and business logic.

---

## 🚀 Features

- List, Add, Edit, and Archive client records (Basic CRUD operations)
- Manage multiple phone numbers per client
- Validation and error handling
- Toast notifications for user feedback
- Connected to a .NET Core API
- Clean, responsive UI with Tailwind CSS
- Built with TypeScript + Vue Router + Axios

---

## 🧱 Tech Stack
- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [Vue Router](https://router.vuejs.org/)
- [Toastification](https://github.com/Maronato/vue-toastification)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🏁 Getting Started

### Prerequisites

- Node.js v16+ recommended
- Backend API running (see [ClientVueDemoDAL](https://github.com/1altaskier/ClientVueDemoDAL)) — update API URLs if needed

### Installation

```bash
# Clone the repository
git clone https://github.com/1altaskier/ClientVueDemoUX.git
cd ClientVueDemoUX

# Install dependencies
npm install

# Run development server
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## 🔌 API Endpoints (Expected)
GET /api/Clients

POST /api/Clients

PUT /api/Clients/{id}

GET /api/PhoneTypes

---

📁 Project Structure
```
src/
├── components/
├── views/
├── router/
├── api/
└── assets/
```

📦 Deployment
npm run build

---

🧠 Author
Britt Moody
GitHub
Feel free to fork, star, or contribute!

📄 License
This project is open source and available under the MIT License.
