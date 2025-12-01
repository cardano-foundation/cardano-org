[![Netlify Status](https://api.netlify.com/api/v1/badges/8cf7b954-67c1-4533-b3b5-fa74f47286a4/deploy-status)](https://app.netlify.com/sites/new-cardano-org-staging/deploys)

# Website

Welcome to the cardano.org website. We believe that this website should be managed by a collective and not a single entity. For this to be successful, the website relies on your contributions.  

cardano.org follows an incremental evolution model. This repository avoids full rebuild projects, agency-led redesigns, or “start from scratch” initiatives unless there is a demonstrated, documented and reviewed technical need. Improvements should be made through small, reviewable, continuously shipped changes.

## Contribution boundaries

Suitable contributions include:  
- Content fixes, clarity, translations (once established), link hygiene. 
- UI/UX improvements that follow existing design tokens. 
- Component or navigation improvements backed by discussion. 
- Docs, accessibility, performance and “paper cut” improvements. 

Not suitable (without prior discussion):
- Visual redesigns, rebranding, theme changes
- Moving to a new framework or build system
- Agency-style proposals for large paid revamps
- Large content reshuffles without information architecture discussion

### Issue claim workflow
1.	Comment “I’d like to work on this”
2.	Wait for maintainer assignment
3.	If inactive for 21 days, issue becomes unassigned

### Start here
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [docs/](https://cardano.org/docs/) for content
- [Dicussions](https://github.com/cardano-foundation/cardano-org/discussions) for idea-level conversations


# Installation

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. This will get you up and running:

## Requirements

[Node.js](https://nodejs.org/en/download/) version >= 18.0
[Yarn](https://yarnpkg.com/en/) version >= 1.22  
On macOS you also need Xcode and Command Line Tools.

## Clone the repo
```
git clone https://github.com/cardano-foundation/cardano-org.git
```
  
## Navigate into the folder
```
cd cardano-org
```

## Install all dependencies
```
yarn install
```

## Start local development

```
yarn start
```

This command starts a local development server and opens up a browser window to http://localhost:3000. Most changes are reflected live without having to restart the server.

To browse the documentation visit http://localhost:3000/docs/.

## Build

```
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. Always build the site once before firing a pull request as many additional checks are carried out.

## Network testing
```
yarn start --host 0.0.0.0   
```
With this command you are making it listen on all network interfaces (IP addresses) of your computer. This includes the local loopback interface (127.0.0.1 or localhost) and any other network interfaces that can connect your computer to a local network or the internet. Great for testing the site with different devices on your local network.

---

# Running Developer Experience in Docker

Docker provides a consistent, isolated development environment that works across Linux, macOS, and Windows. This is the recommended way for open-source contributors to quickly get started with the cardano.org project.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)
- Git

**Note:** Docker Desktop includes both Docker and Docker Compose.

## Quick Start (Recommended)

The fastest way to get started with Docker:

```bash
# Clone the repository
git clone https://github.com/cardano-foundation/cardano-org.git
cd cardano-org

# Start the development server with hot-reload
docker-compose up cardano-dev
```

The site will be available at **http://localhost:3000** with hot-reload enabled. Any changes you make to the source code will automatically refresh in the browser.

Press `Ctrl+C` to stop the container.

## Docker Services

The project includes four Docker services optimized for different workflows:

### 1. Development Service (cardano-dev) - Hot Reload

Perfect for daily development with instant feedback:

```bash
# Start in foreground (see logs)
docker-compose up cardano-dev

# Start in background (detached mode)
docker-compose up -d cardano-dev

# View logs
docker-compose logs -f cardano-dev

# Stop the service
docker-compose down
```

**Features:**
- ✅ Hot-reload enabled (changes reflect immediately)
- ✅ Source code mounted as volumes
- ✅ Available at http://localhost:3000
- ✅ Full development environment

### 2. Production Service (cardano-prod) - Preview Production Build

Test the production build locally:

```bash
# Build and run production version
docker-compose up cardano-prod
```

**Features:**
- ✅ Optimized production build
- ✅ Minimal container size
- ✅ Available at http://localhost:3001
- ✅ Mimics production environment

### 3. Test Service (cardano-test) - Validation

Run builds and validations (useful for CI/CD):

```bash
# Run tests
docker-compose up cardano-test

# Run specific test commands
docker-compose run cardano-test yarn build
```

### 4. Builder Service (cardano-builder) - Local Production Builds

Generate production build artifacts locally:

```bash
# Build and output to ./build directory
docker-compose up cardano-builder
```

The production files will be available in the `./build` directory on your host machine.

## Detailed Docker Commands

### Building Docker Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build cardano-dev

# Build without cache (fresh build)
docker-compose build --no-cache cardano-dev

# Build with BuildKit for faster builds (recommended)
DOCKER_BUILDKIT=1 docker-compose build
```

### Running Containers

```bash
# Start development environment
docker-compose up cardano-dev

# Start in detached mode (background)
docker-compose up -d cardano-dev

# Force recreate containers
docker-compose up --force-recreate cardano-dev

# Scale services (not typically needed for this project)
docker-compose up --scale cardano-dev=1
```

### Managing Containers

```bash
# List running containers
docker-compose ps

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs cardano-dev

# Follow logs in real-time
docker-compose logs -f cardano-dev

# Execute commands inside running container
docker-compose exec cardano-dev sh
docker-compose exec cardano-dev yarn --version

# Run one-off commands
docker-compose run cardano-dev yarn build-authors
```

## Volume Mounting and Hot Reload

The development container mounts your source code for hot-reload:

**Mounted directories:**
- `./docs` - Documentation content
- `./blog` - Blog posts
- `./src` - React components and custom code
- `./static` - Static assets
- `./scripts` - Build scripts
- Configuration files (docusaurus.config.js, sidebars.js, etc.)

**Excluded from mount** (container-managed):
- `node_modules` - Managed by container
- `.docusaurus` - Build cache
- `build` - Production output

This setup ensures consistent dependencies while allowing instant source code updates.

## Port Configuration

| Service | Container Port | Host Port | URL |
|---------|----------------|-----------|-----|
| cardano-dev | 3000 | 3000 | http://localhost:3000 |
| cardano-prod | 3000 | 3001 | http://localhost:3001 |

To change ports, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Maps host port 8080 to container port 3000
```

## Environment Variables

Configure environment variables in `docker-compose.yml`:

```yaml
environment:
  NODE_ENV: development
  CARDANO_ORG_API_URL: https://data.cardano.org/k/api/v1
  CARDANO_ORG_API_KEY: your-api-key-here
```

Or create a `.env` file in the project root:

```env
CARDANO_ORG_API_URL=https://data.cardano.org/k/api/v1
CARDANO_ORG_API_KEY=your-api-key-here
```

## Running Tests in Docker

```bash
# Run build validation
docker-compose up cardano-test

# Run specific yarn commands
docker-compose run cardano-test yarn build
docker-compose run cardano-test yarn build-authors

# Run with shell access for debugging
docker-compose run cardano-test sh
```

## Building for Production in Docker

### Option 1: Using Docker Compose (Recommended)

```bash
# Build production image
docker-compose build cardano-prod

# Run production server
docker-compose up cardano-prod

# Access at http://localhost:3001
```

### Option 2: Using Dockerfile Directly

```bash
# Build production image
docker build -t cardano-org:production --target production .

# Run production container
docker run -p 3000:3000 cardano-org:production
```

### Option 3: Export Build Artifacts

```bash
# Generate build files in ./build directory
docker-compose up cardano-builder

# The ./build directory now contains static files
# Deploy these to any static hosting service
```

## Troubleshooting

### Container won't start

```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs cardano-dev

# Restart container
docker-compose restart cardano-dev

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache cardano-dev
docker-compose up cardano-dev
```

### Hot reload not working

```bash
# On Windows/Mac, ensure file sharing is enabled in Docker Desktop settings
# On Linux, ensure proper permissions

# Try increasing polling interval (already configured in docker-compose.yml)
# Environment variables: WATCHPACK_POLLING=true, CHOKIDAR_USEPOLLING=true
```

### Permission issues (Linux)

```bash
# If you encounter permission errors with mounted volumes
# Run container as your user
docker-compose run --user $(id -u):$(id -g) cardano-dev sh
```

### Out of disk space

```bash
# Clean up unused Docker resources
docker system prune -a

# Remove unused volumes
docker volume prune

# Remove specific containers
docker-compose down -v
```

### Port already in use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in docker-compose.yml
```

### Dependency issues

```bash
# Clear node_modules and reinstall
docker-compose down -v
docker-compose build --no-cache cardano-dev
docker-compose up cardano-dev
```

## Advanced Usage

### Using Docker without Docker Compose

```bash
# Build development image
docker build -t cardano-org:dev --target development .

# Run with volume mounts
docker run -it --rm \
  -p 3000:3000 \
  -v $(pwd)/docs:/app/docs \
  -v $(pwd)/blog:/app/blog \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/static:/app/static \
  cardano-org:dev

# Build production image
docker build -t cardano-org:prod --target production .

# Run production
docker run -p 3000:3000 cardano-org:prod
```

### Multi-platform Builds

Build images for different architectures (useful for ARM-based Macs):

```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t cardano-org:latest .
```

### Debugging Inside Container

```bash
# Access shell in running container
docker-compose exec cardano-dev sh

# Or start a new container with shell
docker-compose run cardano-dev sh

# Inside container, you can run:
yarn --version
node --version
ls -la
yarn build-authors
```

### Inspect Container

```bash
# View container details
docker-compose exec cardano-dev sh -c "node --version && yarn --version"

# Check disk usage
docker-compose exec cardano-dev df -h

# Check running processes
docker-compose exec cardano-dev ps aux
```

## Pushing to Docker Hub (Optional)

For maintainers who want to publish pre-built images:

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag cardano-org:dev yourusername/cardano-org:dev
docker tag cardano-org:prod yourusername/cardano-org:prod

# Push to Docker Hub
docker push yourusername/cardano-org:dev
docker push yourusername/cardano-org:prod

# Pull from Docker Hub (for users)
docker pull yourusername/cardano-org:dev
docker-compose up cardano-dev
```

### Using Pre-built Images

To use pre-built images from Docker Hub, update `docker-compose.yml`:

```yaml
services:
  cardano-dev:
    image: yourusername/cardano-org:dev
    # Remove or comment out the 'build' section
```

## CI/CD Integration

Use Docker in your CI/CD pipeline:

```bash
# GitHub Actions / GitLab CI example
docker-compose run cardano-test yarn build

# If build succeeds, push images
docker-compose build cardano-prod
docker tag cardano-org:prod yourusername/cardano-org:latest
docker push yourusername/cardano-org:latest
```

## Performance Tips

1. **Use BuildKit**: Enable Docker BuildKit for faster builds
   ```bash
   export DOCKER_BUILDKIT=1
   docker-compose build
   ```

2. **Layer Caching**: Dependencies are cached in separate layers. Only source code changes trigger full rebuilds.

3. **Multi-stage Builds**: The Dockerfile uses multi-stage builds to minimize final image size.

4. **Volume Performance**: On Windows/Mac, use named volumes for better performance with `node_modules`.

5. **Resource Limits**: Increase Docker Desktop resources (CPU, Memory) for better performance:
   - Docker Desktop → Settings → Resources
   - Recommended: 4 CPU, 8GB RAM

## Cross-Platform Compatibility

This Docker setup works consistently across:

- ✅ **Linux** (Ubuntu, Debian, Fedora, etc.)
- ✅ **macOS** (Intel and Apple Silicon)
- ✅ **Windows** (with WSL2 recommended)

### Windows-Specific Notes

1. **Use WSL2**: For best performance, use WSL2 backend in Docker Desktop
2. **Line Endings**: Git should be configured to use LF line endings
   ```bash
   git config --global core.autocrlf false
   ```
3. **File Paths**: Use Unix-style paths in commands

### macOS-Specific Notes

1. **Apple Silicon (M1/M2)**: The Docker images support ARM64 architecture
2. **File Sharing**: Ensure the project directory is in Docker Desktop's file sharing settings

### Linux-Specific Notes

1. **User Permissions**: Docker runs as root by default. Use `--user` flag if needed.
2. **Docker Group**: Add your user to the docker group to avoid using sudo:
   ```bash
   sudo usermod -aG docker $USER
   ```

## Summary

Docker provides a consistent development environment for all contributors. The recommended workflow is:

1. **Clone the repository**
2. **Run** `docker-compose up cardano-dev`
3. **Develop** with hot-reload at http://localhost:3000
4. **Test** with `docker-compose up cardano-test`
5. **Build** production with `docker-compose up cardano-prod`

For questions or issues, see [CONTRIBUTING.md](CONTRIBUTING.md) or [open a discussion](https://github.com/cardano-foundation/cardano-org/discussions).

