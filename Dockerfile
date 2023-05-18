FROM node:16

WORKDIR /gptnotes

# Create a non-root user
RUN useradd -m devuser
# Switch to devuser
USER devuser


# Use shell by default
CMD ["/bin/bash"]


