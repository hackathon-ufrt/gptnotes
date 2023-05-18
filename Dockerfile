FROM node:16

WORKDIR /gptnotes

# Create a non-root user
RUN useradd -m devuser
USER devuser

# Use shell by default
CMD ["/bin/bash"]


