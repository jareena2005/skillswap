# SkillSwap 🚀

SkillSwap is a full-stack peer-to-peer skill exchange platform that helps users teach what they know and learn what they want. It combines a modern React dashboard with a Django REST backend, a smart recommendation engine, swap workflows, session scheduling, and real-time chat.

## ✨ Core Features

- **Authentication**: Standard login plus Google OAuth2 sign-in.
- **Teach/Want Skill Profiles**: Users add skills they can teach (`offer`) and skills they want to learn (`want`).
- **Smart Recommendations**: Matches users based on skills offered by others that you want, and optionally based on reciprocal wants.
- **Swap Requests**: Create, send, accept, and reject skill swap proposals.
- **Session Scheduling**: Propose dates/times for accepted swaps and manage scheduled sessions.
- **Real-time Chat**: WebSocket chat rooms for swap participants.
- **Profile Management**: Update user profile, bio, availability, location, and photo.

## 🧱 Project Structure

### Backend (`backend/`)
- `backend/` — Django project config, URL routing, ASGI/WSGI setup, and settings.
- `users/` — registration, Google login, JWT auth, profile API.
- `skills/` — skill catalog, user skill CRUD, teach/want save flow.
- `swaps/` — recommendations, swap requests, session proposals, ratings.
- `chat/` — WebSocket consumer for real-time chat.

### Frontend (`frontend/`)
- `src/App.jsx` — route definitions and auth flow.
- `src/main.jsx` — app bootstrap and Google OAuth provider.
- `src/components/` — Dashboard, Teach, Login, Register, Profile, Browse, Chat, and supporting views.

## 📌 What’s Included

### Authentication
- JWT login via `POST /api/token/`
- Google OAuth login via `POST /api/users/google-login/`
- Profile endpoint at `GET /api/users/profile/` and `PUT /api/users/profile/`

### Skill Management
- View skill catalog: `GET /api/skills/`
- View user skills: `GET /api/skills/me/`
- Save teach/want lists: `POST /api/skills/me/full/`
- Delete a user skill: `DELETE /api/skills/me/delete/`

### Recommendations & Swap Flow
- Smart recommendations: `GET /api/swaps/recommendations/`
- Create swap request: `POST /api/swaps/create/`
- Respond to request: `POST /api/swaps/respond/<swap_id>/`
- Incoming requests: `GET /api/swaps/incoming/`
- Accepted swaps: `GET /api/swaps/accepted/`

### Session Booking
- Propose session: `POST /api/swaps/session/propose/`
- Incoming sessions: `GET /api/swaps/session/incoming/`
- Respond to session: `POST /api/swaps/session/respond/<session_id>/`
- Scheduled sessions: `GET /api/swaps/session/scheduled/`
- Complete session: `POST /api/swaps/session/complete/<session_id>/`
- Rate session: `POST /api/swaps/session/rate/<session_id>/`

### Chat
- WebSocket route: `ws/chat/<room_name>/`
- Real-time consumer defined in `backend/chat/consumers.py`

## 🛠️ Tech Stack

### Backend
- Django 6.0.1
- Django REST Framework
- Django Channels
- Daphne
- django-cors-headers
- Django SimpleJWT
- Redis for channel layer
- SQLite for development

### Frontend
- React 18
- Vite
- React Router DOM 6
- Axios
- Google OAuth React SDK
- Tailwind CSS

## 📦 Dependencies

### Backend Dependencies

- asgiref==3.11.0
- attrs==25.4.0
- autobahn==25.12.2
- Automat==25.4.16
- cbor2==5.8.0
- cffi==2.0.0
- channels==4.3.2
- channels_redis==4.3.0
- constantly==23.10.4
- cryptography==46.0.5
- daphne==4.2.1
- Django==6.0.1
- django-cors-headers==4.9.0
- djangorestframework==3.16.1
- djangorestframework_simplejwt==5.5.1
- hyperlink==21.0.0
- idna==3.11
- Incremental==24.11.0
- msgpack==1.1.2
- packaging==26.0
- py-ubjson==0.16.1
- pyasn1==0.6.2
- pyasn1_modules==0.4.2
- pycparser==3.0
- PyJWT==2.10.1
- pyOpenSSL==25.3.0
- redis==7.2.0
- service-identity==24.2.0
- sqlparse==0.5.5
- Twisted==25.5.0
- txaio==25.12.2
- typing_extensions==4.15.0
- tzdata==2025.3
- ujson==5.11.0
- zope.interface==8.2

### Frontend Dependencies

- react 18.2.0
- react-dom 18.2.0
- react-router-dom 6.14.1
- axios
- @react-oauth/google 0.13.5
- vite 5.2.0
- tailwindcss 4.1.18
- postcss 8.5.6
- eslint and React lint tooling

## 🚀 Setup Guide

### Prerequisites

- Python 3.10+
- Node.js 18+
- Redis running locally at `127.0.0.1:6379` for real-time chat

### Backend Setup

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Access

- Backend: `http://127.0.0.1:8000/`
- Frontend: Vite dev URL shown in terminal (typically `http://127.0.0.1:5173/`)

## 🐳 Docker Setup

This project includes a Docker Compose setup for local development.

### Start with Docker

```bash
# from the repository root
docker compose up -d --build
```

### Stop and remove containers

```bash
docker compose down --remove-orphans
```

### View logs

```bash
docker compose logs -f backend
```

### Run management commands in the backend container

```bash
docker compose exec backend python manage.py migrate
```

### Environment files

The Django backend uses `backend/.env` and the repository root `.env` for configuration.
Make sure `SECRET_KEY`, `DATABASE_URL`, and other service variables are set in those files.

## ⚙️ Configuration Notes

- `backend/backend/settings.py` currently uses `DEBUG = True` and SQLite.
- Redis is configured through `CHANNEL_LAYERS` in Django settings.
- Google OAuth client ID is hardcoded in `frontend/src/main.jsx` and `backend/users/views.py`; move this to environment variables for production.
- CORS is open in development with `CORS_ALLOW_ALL_ORIGINS = True`.

## 🧪 Development Notes

- `frontend/src/App.jsx` controls route protection and stores auth tokens in `localStorage`.
- `frontend/src/components/Dashboard.jsx` handles dashboard refresh and shows the recommendation badge.
- `frontend/src/components/Teach.jsx` saves skill offers/wants and triggers dashboard sync.
- `backend/swaps/views.py` contains recommendations, swap request management, and session flows.
- `backend/skills/views.py` manages teach/want persistence.
- `backend/chat/consumers.py` manages real-time WebSocket chat.

## 📘 Recommended Workflow

1. Register or login via Google/email.
2. Add teach/want skills on the Teach page.
3. View smart recommendations on the Dashboard.
4. Send swap requests and manage incoming offers.
5. Accept swaps and schedule a session.
6. Use chat to coordinate the session.

## ✅ Notes

- The project is configured for local development.
- For production, secure `SECRET_KEY`, disable `DEBUG`, and set up a proper database and Redis host.
- The Google OAuth client ID should be configured via environment variables.

---


