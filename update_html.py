import os
import re

dashboard_dir = "/root/.gemini/antigravity-cli/scratch/Quantum-Flow-OS/dashboard"

# Pattern for redirect script block in standalone dashboards
redirect_pattern = re.compile(
    r"<script>\s*// Redirect standalone department view to the unified system dashboard\s*"
    r"const deptName = window\.location\.pathname\.split\('/\)\.pop\(\)\.replace\('\.html', ''\);\s*"
    r"window\.location\.replace\('dashboard\.html\?dept=' \+ deptName \+ window\.location\.search\);\s*</script>",
    re.MULTILINE
)

# New conditional redirect script block
replacement_redirect = """<script>
    // Redirect standalone department view to the unified system dashboard unless standalone parameter is present
    const params = new URLSearchParams(window.location.search);
    if (!params.has('standalone')) {
      const deptName = window.location.pathname.split('/').pop().replace('.html', '');
      window.location.replace('dashboard.html?dept=' + deptName + window.location.search);
    }
  </script>"""

# Process all files in the dashboard folder
for filename in os.listdir(dashboard_dir):
    if filename.endswith(".html") and filename != "index.html" and filename != "dashboard.html":
        filepath = os.path.join(dashboard_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Check if contains the target redirect script
        if "Redirect standalone department view" in content:
            new_content = redirect_pattern.sub(replacement_redirect, content)
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"✅ Updated redirect logic in {filename}")
            else:
                # If regex mismatch but phrase present, try a simpler replace
                old_phrase = """  <script>
    // Redirect standalone department view to the unified system dashboard
    const deptName = window.location.pathname.split('/').pop().replace('.html', '');
    window.location.replace('dashboard.html?dept=' + deptName + window.location.search);
  </script>"""
                new_phrase = """  <script>
    // Redirect standalone department view to the unified system dashboard unless standalone parameter is present
    const params = new URLSearchParams(window.location.search);
    if (!params.has('standalone')) {
      const deptName = window.location.pathname.split('/').pop().replace('.html', '');
      window.location.replace('dashboard.html?dept=' + deptName + window.location.search);
    }
  </script>"""
                if old_phrase in content:
                    content = content.replace(old_phrase, new_phrase)
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"✅ Updated redirect logic in {filename} (via text replacement)")

# Update links in index.html to load with ?standalone=true
index_path = os.path.join(dashboard_dir, "index.html")
if os.path.exists(index_path):
    with open(index_path, "r", encoding="utf-8") as f:
        index_content = f.read()

    # Find and replace href="dashboard.html?dept=xxxx" with href="xxxx.html?standalone=true"
    new_index_content = re.sub(
        r'href="dashboard\.html\?dept=([^"]+)"',
        r'href="\1.html?standalone=true"',
        index_content
    )

    if new_index_content != index_content:
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(new_index_content)
        print("✅ Successfully updated all landing page department cards to link directly to standalone layouts.")
