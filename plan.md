# Plan for Super Productivity Date Range Reporter Plugin

### Step 1: Understanding the Current Structure

The plugin currently has these key components:[1]

- **`plugin.js`**: Registers a header button that opens the report interface
- **`manifest.json.template`**: Defines plugin permissions including `getTasks`,
  `getArchivedTasks`
- **`index.html`**: Contains the UI and report generation logic (not shown in
  the gitingest but referenced)

### Step 2: Understanding Task Data Structure

Super Productivity tasks have these relevant properties:[2]

| Property       | Type              | Description                          |
| -------------- | ----------------- | ------------------------------------ |
| `id`           | string            | Unique task identifier               |
| `title`        | string            | Task title                           |
| `tagIds`       | string[]          | Array of tag IDs                     |
| `parentId`     | string (optional) | Parent task ID if this is a sub-task |
| `isDone`       | boolean           | Completion status                    |
| `dueOn`        | number (optional) | Due date timestamp                   |
| `notes`        | string (optional) | Task notes                           |
| `timeSpent`    | number            | Time spent in milliseconds           |
| `timeEstimate` | number            | Estimated time                       |
| `subTaskIds`   | string[]          | Array of sub-task IDs                |

### Step 3: Modify the Plugin Code

You'll need to update the `date-range-reporter/index.html` file (create it if
not in gitingest). Here's how to add support for current tasks with tags,
subtasks, and due dates:

**Key modifications needed:**

1. **Fetch current tasks** using the existing permission:

```javascript
const currentTasks = await PluginAPI.getTasks();
```

2. **Get all projects and tags** to resolve IDs:

```javascript
const projects = await PluginAPI.getAllProjects();
const tags = await PluginAPI.getAllTags(); // You may need to check if this exists
```

3. **Add a new section to generate current tasks report**:

```javascript
function generateCurrentTasksReport() {
    const tasks = await PluginAPI.getTasks();
    let report = "# Current Tasks Report\n\n";

    tasks.forEach((task) => {
        // Main task
        report += `## ${task.title}\n`;

        // Tags
        if (task.tagIds && task.tagIds.length > 0) {
            const tagNames = task.tagIds.map((id) => getTagName(id)).join(", ");
            report += `**Tags:** ${tagNames}\n`;
        }

        // Due date
        if (task.dueOn) {
            const dueDate = new Date(task.dueOn);
            report += `**Due:** ${formatDate(dueDate)}\n`;
        }

        // Status
        report += `**Status:** ${task.isDone ? "Complete" : "In Progress"}\n`;

        // Notes
        if (task.notes) {
            report += `**Notes:** ${task.notes}\n`;
        }

        // Subtasks
        if (task.subTaskIds && task.subTaskIds.length > 0) {
            report += `\n### Subtasks:\n`;
            task.subTaskIds.forEach((subId) => {
                const subTask = tasks.find((t) => t.id === subId);
                if (subTask) {
                    report += `- [${
                        subTask.isDone ? "x" : " "
                    }] ${subTask.title}`;
                    if (subTask.dueOn) {
                        report += ` (Due: ${
                            formatDate(new Date(subTask.dueOn))
                        })`;
                    }
                    report += `\n`;
                }
            });
        }

        report += "\n---\n\n";
    });

    return report;
}
```

4. **Add a new button to the UI** for generating current tasks report:

```html
<button id="generate-current-tasks" class="btn">
    Generate Current Tasks Report
</button>
```

### Step 4: Update Manifest Permissions

The current manifest already has the necessary permissions, but you may want to
add tag-related permissions if they exist:[1]

```json
"permissions": [
  "getTasks",
  "getArchivedTasks",
  "getAllTags",
  "showSnack",
  "persistDataSynced",
  "loadSyncedData"
]
```

### Step 5: Build and Test

1. **Build the plugin**:

```bash
make build
```

2. **Install in Super Productivity**:
   - Open Super Productivity
   - Go to Settings → Extensions
   - Click "Add Plugin"
   - Upload the generated `date-range-reporter.zip` file[1]

3. **Test the new functionality**:
   - Create tasks with tags, subtasks, and due dates
   - Click the plugin button and generate the report
   - Verify all fields are included

### Step 6: Version and Release

1. **Update version in `package.json`**:

```json
"version": "2.0.0"
```

2. **Commit your changes**:

```bash
git add .
git commit -m "Add support for current tasks with tags, subtasks, and due dates"
git push origin main
```

3. **Create a release** (optional):

```bash
make release
```

This creates a GitHub release with the built plugin zip file.[1]

### Additional Features to Consider

- Add filtering options (show only incomplete tasks, filter by tag)
- Include time estimates and time spent
- Add export to CSV format for better printing
- Group tasks by project or tag
- Add print-specific CSS styling for cleaner paper output

### About super-productivity plug-ins

Super Productivity has a powerful plugin system that you can use to integrate an
open-source LLM through OpenRouter. Here's how to implement this:​

​ Plugin Architecture

Super Productivity supports custom plugins that can extend functionality through
its Plugin API. Plugins can create tasks, update task details, apply tags, and
interact with all core features through a comprehensive API. ​

​ Implementation Approach Create a Plugin Structure

You'll need to create a plugin with these core files:
​

    manifest.json: Defines plugin metadata, permissions, and configuration

    plugin.js/plugin.ts: Main plugin code that handles LLM API calls

    index.html (optional): UI interface for the plugin

    icon.svg (optional): Plugin icon

Connect to OpenRouter

OpenRouter provides a unified API gateway that lets you access multiple LLM
models with a single API key. You can integrate it by:
​

    Setting your OpenRouter API endpoint: https://openrouter.ai/api/v1/chat/completions

​
Using OpenAI-compatible SDK format, simply changing the base URL

​
Switching between models by changing the model parameter (e.g., openai/gpt-4o,
anthropic/claude-3.5-sonnet)
  ​

Plugin API Capabilities

The plugin API provides methods to:

​

    Task Management: addTask(), updateTask(), getTasks(), getArchivedTasks()

    Project Operations: addProject(), getAllProjects()

    Tag Management: addTag(), getAllTags()

    Notes: Access and update task notes

    Hooks: Register event handlers for task updates, creation, and other events

Implementation Example

Your plugin would:

    Register hooks to detect when you need LLM assistance (e.g., task creation or update events)

​

Send task context to OpenRouter's API with your chosen LLM model

​

Process the LLM response to generate notes, suggest tags, or add details

​

Use Plugin API methods to update the task with enriched information

    ​

Development Options

Super Productivity provides three plugin development templates:

​

    minimal-plugin: Plain JavaScript, simplest approach

    simple-typescript-plugin: TypeScript with basic build tools

    example-plugin: Full-featured with webpack and advanced tooling

For LLM integration, the TypeScript option is recommended for type safety and
API discovery.

​ Testing and Installation

Once built, you can install your plugin by:

​

    Building the plugin: npm run build && npm run package

    Opening Super Productivity → Settings → Plugins

    Clicking "Upload Plugin" and selecting your .zip file

The plugin system supports configuration schemas, allowing users to input their
OpenRouter API key through the settings UI.
