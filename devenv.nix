{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: {
  # https://devenv.sh/packages/
  packages = [
    # pkgs.nodePackages.pnpm
  ];

  # https://devenv.sh/languages/
  languages = {
    javascript = {
      enable = true;
      pnpm.enable = true;
    };
    typescript.enable = true;
  };

  # https://devenv.sh/scripts/
  scripts.dev.exec = "pnpm dev";

  # https://devenv.sh/pre-commit-hooks/

  # See full reference at https://devenv.sh/reference/options/
}
