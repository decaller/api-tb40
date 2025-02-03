# Docker Deployment Guide with GitHub Container Registry and Portainer

## 1. GitHub Container Registry Setup

1. Create Personal Access Token (PAT):
   - Go to GitHub Settings > Developer Settings > Personal Access Tokens
   - Generate new token with `write:packages` and `read:packages` permissions
   - Save the token securely

2. Create GitHub Actions workflow (`.github/workflows/docker-build.yml`):
```yaml
name: Build and Push to GitHub Container Registry

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  build-and-push:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
```

## 2. Dockerfile Setup

Create `Dockerfile` in project root:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm", "start"]
```

## 3. Docker Compose Setup

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  api-tb40:
    image: ghcr.io/[your-username]/api-tb40:latest
    container_name: api-tb40
    ports:
      - "4040:4040"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## 4. Portainer Deployment Steps

1. Access Portainer:
   - Open Portainer dashboard (usually at `http://your-server:9000`)
   - Login with your credentials

2. Add Stack:
   - Go to Stacks > Add Stack
   - Name your stack (e.g., "api-tb40")
   - Copy-paste the docker-compose content
   - Add GitHub Container Registry credentials:
     ```bash
     docker login ghcr.io -u [your-github-username] -p [your-PAT]
     ```

3. Deploy Stack:
   - Click "Deploy the stack"
   - Monitor the deployment in Portainer

## 5. Monitoring and Maintenance

1. View Logs:
   - In Portainer, go to Containers
   - Click on your container
   - Select "Logs" tab

2. Container Management:
   - Use Portainer UI to:
     - Start/Stop containers
     - View resource usage
     - Update images
     - Scale services

## Notes

- Replace `[your-username]` with your GitHub username
- Ensure your GitHub Container Registry package is public or properly configured for private access
- Store sensitive data in environment variables or secrets
- Regular monitoring of logs and performance is recommended
