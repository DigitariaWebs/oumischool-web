# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Interactive resource preview:** Dashboard now opens interactive resources directly via API URL instead of proxying through a Next.js route

### Removed

- **Resource view proxy route:** Deleted `app/resource/[id]/view/route.ts` — clients now hit the API directly, eliminating an unnecessary network hop
