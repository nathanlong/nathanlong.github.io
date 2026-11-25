#!/bin/zsh
# Creates a new blog post with its frontmatter filled in.
set -eu
cd "${0:A:h}/.."
source ./bin/utils.sh

# Frontmatter value as a double-quoted YAML string, so ':' or '#' in a title
# can't break the file
yaml_string() {
  local value=${1//\\/\\\\}
  printf '"%s"' "${value//\"/\\\"}"
}

e_header "Creating new entry..."
e_question "What's the slug? (lowercase, dash-separated)"
read -r slug
if [[ ! $slug =~ '^[a-z0-9]+(-[a-z0-9]+)*$' ]]; then
  e_error "Slug must be lowercase letters and numbers, separated by dashes"
  exit 1
fi
new_path="src/content/blog/${slug}.md"
if [[ -e $new_path || -e ${new_path}x ]]; then
  e_error "A post with that slug already exists: ${new_path}(x)"
  exit 1
fi

e_question "What's the title? (string)"
read -r title
e_question "What's the description? (string)"
read -r description
existing_tags=$(grep -h '^tags:' src/content/blog/*.md* | tr -d '[]' | sed 's/^tags: *//' | tr ',' '\n' | sed 's/^ *//;s/ *$//' | sort -u | paste -sd, - | sed 's/,/, /g')
e_question "What tags? (comma-separated; existing: ${existing_tags})"
read -r tags

# ISO timestamp with offset, so the date doesn't shift by timezone
new_date="$(date '+%Y-%m-%dT%H:%M:%S%z')"

cat > "$new_path" <<EOF
---
title: $(yaml_string "$title")
description: $(yaml_string "$description")
pubDate: ${new_date}
tags: [${tags}]
---

EOF

e_success "New entry created: ${new_path}"
