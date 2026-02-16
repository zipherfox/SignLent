{
  description = "SignLent – AI-powered sign language translator";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = {nixpkgs, ...}: let
    supportedSystems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
  in {
    packages = forAllSystems (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};

        signlent = pkgs.stdenvNoCC.mkDerivation (finalAttrs: {
          pname = "signlent";
          version = "0.1.0";
          src = ./.;

          nativeBuildInputs = [
            pkgs.nodejs_22
            pkgs.pnpm
            pkgs.pnpmConfigHook
          ];

          # First build: replace this hash with the one nix reports.
          #   nix build .#signlent 2>&1 | grep "got:"
          pnpmDeps = pkgs.fetchPnpmDeps {
            fetcherVersion = 2;
            inherit (finalAttrs) pname version src;
            hash = "sha256-7ERt7qbhmpDTSs/QbvHvZztP72/G5rPLm/L7dBlow4o=";
          };

          buildPhase = ''
            runHook preBuild
            pnpm run postinstall
            pnpm run build
            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall

            mkdir -p $out/lib/signlent
            cp -r dist/spa $out/lib/signlent/spa
            cp -r dist/server $out/lib/signlent/server

            # Express is needed at runtime
            cp -r node_modules $out/lib/signlent/node_modules

            runHook postInstall
          '';
        });

        wrapper = pkgs.writeShellScriptBin "signlent" ''
          set -euo pipefail

          CERT_DIR="$(mktemp -d)"
          trap "rm -rf $CERT_DIR" EXIT

          echo "🔐 Generating self-signed TLS certificate for localhost…"
          ${pkgs.openssl}/bin/openssl req -x509 \
            -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
            -nodes -keyout "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.pem" \
            -days 365 -subj "/CN=localhost" 2>/dev/null

          export SIGNLENT_CERT_DIR="$CERT_DIR"
          exec ${pkgs.nodejs_22}/bin/node ${signlent}/lib/signlent/server/node-build.mjs
        '';
      in {
        default = wrapper;
        inherit signlent;
      }
    );
  };
}
