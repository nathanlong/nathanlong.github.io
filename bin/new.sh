#!/bin/zsh

# must be run from project root
source ./bin/utils.sh

e_header "Creating new entry..."
e_question "What's the slug gonna be? (lowercase, dash-separated)"
read slug
e_question "What's the title? (string)"
read title
e_question "What tags? array:[motion, neovim, thoughts, tooling]"
read tags
new_path="content/blog/${slug}.md"
new_date="$(date '+%Y-%m-%d')"
touch ${new_path}

# Prepend yaml, we have to rewrite the file back in tho :(
echo -e "---\ntitle: ${title}\ndescription:\ndate: ${new_date}\ntags: ${tags}\n---\n" > "${new_path}"

e_success "New entry created!"
