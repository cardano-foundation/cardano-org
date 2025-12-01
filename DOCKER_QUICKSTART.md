# 🚀 Quick Start with Docker

Get the Cardano.org Developer Portal running in under 2 minutes!

## Step 1: Install Docker

**Choose your platform:**

- **macOS:** [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Windows:** [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) (WSL2 recommended)
- **Linux:** [Docker Engine for Linux](https://docs.docker.com/engine/install/)

Verify installation:
```bash
docker --version
docker-compose --version
```

## Step 2: Clone and Start

```bash
# Clone the repository
git clone https://github.com/cardano-foundation/cardano-org.git
cd cardano-org

# Start development environment (this will take 3-5 minutes the first time)
docker-compose up cardano-dev
```

## Step 3: Open in Browser

Open your browser to: **http://localhost:3000**

That's it! 🎉

## What's Running?

- ✅ Docusaurus development server
- ✅ Hot-reload enabled (changes update automatically)
- ✅ Full Node.js environment
- ✅ All dependencies installed

## Making Changes

1. Edit any file in `docs/`, `blog/`, or `src/`
2. Save the file
3. Browser automatically refreshes with your changes

## Stop the Server

Press `Ctrl+C` in the terminal

Or if running in background:
```bash
docker-compose down
```

## Common Commands

```bash
# Start in background (detached mode)
docker-compose up -d cardano-dev

# View logs
docker-compose logs -f cardano-dev

# Stop everything
docker-compose down

# Rebuild (if you update dependencies)
docker-compose build cardano-dev

# Run production build locally
docker-compose up cardano-prod
# Then open: http://localhost:3001
```

## Troubleshooting

### Port 3000 already in use?
```bash
# Change the port in docker-compose.yml
ports:
  - "8080:3000"  # Use port 8080 instead
```

### Container won't start?
```bash
# Rebuild from scratch
docker-compose down
docker-compose build --no-cache cardano-dev
docker-compose up cardano-dev
```

### Need help?
```bash
# Access container shell
docker-compose exec cardano-dev sh

# Check what's inside
ls -la
node --version
yarn --version
```

## Next Steps

- 📖 Read [README.md](README.md) for detailed documentation
- 🐳 See [DOCKER_STRATEGY.md](DOCKER_STRATEGY.md) for architecture details
- 🤝 Read [CONTRIBUTING.md](CONTRIBUTING.md) to start contributing
- 💬 Join [Discussions](https://github.com/cardano-foundation/cardano-org/discussions)

## Comparison: Docker vs. Local Installation

| Feature | Docker | Local Install |
|---------|--------|---------------|
| Setup time | 2 minutes | 10-20 minutes |
| Dependencies | Automatic | Manual (Node, Yarn, etc.) |
| Consistency | ✅ Always same | ⚠️ Varies by system |
| Isolation | ✅ Contained | ❌ Global install |
| Cross-platform | ✅ Linux/Mac/Windows | ⚠️ Some issues |
| Disk space | ~1.5GB | ~500MB |
| Performance | 95-100% native | 100% native |

**Recommendation:** Use Docker for development, especially if you're a contributor.

---

**Need more control?** See the full Docker documentation in [README.md](README.md#running-developer-experience-in-docker)
