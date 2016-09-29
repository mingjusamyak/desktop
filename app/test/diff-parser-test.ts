import { DiffParser } from '../src/lib/diff-parser'
// Atom doesn't like lines with just one space and tries to
// de-indent so when copying- and pasting diff contents the
// space signalling that the line is a context line gets lost.
//
// This function reinstates that space and makes us all
// feel a little bit sad.
function reinstateSpacesAtTheStartOfBlankLines(text: string) {
  return text.replace(/\n\n/g, '\n \n')
}

describe('DiffParser', () => {
  it('parses changed files', () => {
    const diffText = `diff --git a/app/src/lib/diff-parser.ts b/app/src/lib/diff-parser.ts
    const parser = new DiffParser()
    const diff = parser.parse(reinstateSpacesAtTheStartOfBlankLines(diffText))
    expect(lines[i].text).to.equal(' ')
    expect(lines[i].text).to.equal(' ')
  it('parses new files', () => {
    const diffText = `diff --git a/testste b/testste
`
    const parser = new DiffParser()
    const diff = parser.parse(diffText)

  it('parses files containing @@', () => {
    const diffText = `diff --git a/test.txt b/test.txt
index 24219cc..bf711a5 100644
--- a/test.txt
+++ b/test.txt
@@ -1 +1 @@
-foo @@
+@@ foo
`

    const parser = new DiffParser()
    const diff = parser.parse(diffText)
    expect(diff.sections.length).to.equal(1)

    const section = diff.sections[0]
    expect(section.unifiedDiffStart).to.equal(0)
    expect(section.unifiedDiffEnd).to.equal(2)

    const lines = section.lines
    expect(lines.length).to.equal(3)

    let i = 0
    expect(lines[i].text).to.equal('@@ -1 +1 @@')
    expect(lines[i].type).to.equal(DiffLineType.Hunk)
    expect(lines[i].oldLineNumber).to.equal(null)
    expect(lines[i].newLineNumber).to.equal(null)
    i++

    expect(lines[i].text).to.equal('-foo @@')
    expect(lines[i].type).to.equal(DiffLineType.Delete)
    expect(lines[i].oldLineNumber).to.equal(1)
    expect(lines[i].newLineNumber).to.equal(null)
    i++

    expect(lines[i].text).to.equal('+@@ foo')
    expect(lines[i].type).to.equal(DiffLineType.Add)
    expect(lines[i].oldLineNumber).to.equal(null)
    expect(lines[i].newLineNumber).to.equal(1)
    i++
  })

  it('parses new files without a newline at end of file', () => {
    const diffText = `diff --git a/test2.txt b/test2.txt
new file mode 100644
index 0000000..faf7da1
--- /dev/null
+++ b/test2.txt
@@ -0,0 +1 @@
+asdasdasd
\\ No newline at end of file
`

    const parser = new DiffParser()
    const diff = parser.parse(diffText)
    expect(diff.sections.length).to.equal(1)

    const section = diff.sections[0]
    expect(section.unifiedDiffStart).to.equal(0)
    expect(section.unifiedDiffEnd).to.equal(1)

    const lines = section.lines
    expect(lines.length).to.equal(2)

    let i = 0
    expect(lines[i].text).to.equal('@@ -0,0 +1 @@')
    expect(lines[i].type).to.equal(DiffLineType.Hunk)
    expect(lines[i].oldLineNumber).to.equal(null)
    expect(lines[i].newLineNumber).to.equal(null)
    expect(lines[i].noTrailingNewLine).to.be.false
    i++

    expect(lines[i].text).to.equal('+asdasdasd')
    expect(lines[i].type).to.equal(DiffLineType.Add)
    expect(lines[i].oldLineNumber).to.equal(null)
    expect(lines[i].newLineNumber).to.equal(1)
    expect(lines[i].noTrailingNewLine).to.be.true
    i++
  })

  it('parses diffs that adds newline to end of file', () => {
    const diffText = `diff --git a/test2.txt b/test2.txt
index 1910281..257cc56 100644
--- a/test2.txt
+++ b/test2.txt
@@ -1 +1 @@
-foo
\\ No newline at end of file
+foo
`
    const parser = new DiffParser()
    const diff = parser.parse(diffText)
    expect(diff.sections.length).to.equal(1)

    const section = diff.sections[0]
    expect(section.unifiedDiffStart).to.equal(0)
    expect(section.unifiedDiffEnd).to.equal(2)

    const lines = section.lines
    expect(lines.length).to.equal(3)

    let i = 0
    expect(lines[i].text).to.equal('@@ -1 +1 @@')
    expect(lines[i].type).to.equal(DiffLineType.Hunk)
    expect(lines[i].oldLineNumber).to.equal(null)
    expect(lines[i].newLineNumber).to.equal(null)
    expect(lines[i].noTrailingNewLine).to.be.false
    i++

    expect(lines[i].text).to.equal('-foo')
    expect(lines[i].type).to.equal(DiffLineType.Delete)
    expect(lines[i].oldLineNumber).to.equal(1)
    expect(lines[i].newLineNumber).to.equal(null)
    expect(lines[i].noTrailingNewLine).to.be.true
    i++

    expect(lines[i].text).to.equal('+foo')
    expect(lines[i].type).to.equal(DiffLineType.Add)
    expect(lines[i].oldLineNumber).to.equal(null)
    expect(lines[i].newLineNumber).to.equal(1)
    expect(lines[i].noTrailingNewLine).to.be.false
    i++

  })

  it('parses diffs where neither file version has a trailing newline', () => {
    // echo -n 'foo' >  test
    // git add -A && git commit -m foo
    // echo -n 'bar' > test
    // git diff test
    const diffText = `diff --git a/test b/test
index 1910281..ba0e162 100644
--- a/test
+++ b/test
@@ -1 +1 @@
-foo
\\ No newline at end of file
+bar
\\ No newline at end of file
`
    const parser = new DiffParser()
    const diff = parser.parse(diffText)
    expect(diff.sections.length).to.equal(1)

    const section = diff.sections[0]
    expect(section.unifiedDiffStart).to.equal(0)
    expect(section.unifiedDiffEnd).to.equal(2)

    const lines = section.lines
    expect(lines.length).to.equal(3)

    let i = 0
    expect(lines[i].text).to.equal('@@ -1 +1 @@')
    expect(lines[i].type).to.equal(DiffLineType.Hunk)
    expect(lines[i].oldLineNumber).to.equal(null)
    expect(lines[i].newLineNumber).to.equal(null)
    expect(lines[i].noTrailingNewLine).to.be.false
    i++

    expect(lines[i].text).to.equal('-foo')
    expect(lines[i].type).to.equal(DiffLineType.Delete)
    expect(lines[i].oldLineNumber).to.equal(1)
    expect(lines[i].newLineNumber).to.equal(null)
    expect(lines[i].noTrailingNewLine).to.be.true
    i++

    expect(lines[i].text).to.equal('+bar')
    expect(lines[i].type).to.equal(DiffLineType.Add)
    expect(lines[i].oldLineNumber).to.equal(null)
    expect(lines[i].newLineNumber).to.equal(1)
    expect(lines[i].noTrailingNewLine).to.be.true
    i++

  })

  it('parses binary diffs', () => {
    const diffText = `diff --git a/IMG_2306.CR2 b/IMG_2306.CR2
new file mode 100644
index 0000000..4bf3a64
Binary files /dev/null and b/IMG_2306.CR2 differ
`
    const parser = new DiffParser()
    const diff = parser.parse(diffText)
    expect(diff.sections.length).to.equal(0)
    expect(diff.isBinary).to.equal(true)
  })

  it('parses diff of empty file', () => {
    // To produce this output, do
    // touch foo
    // git diff --no-index --patch-with-raw -z -- /dev/null foo
    const diffText = `new file mode 100644
index 0000000..e69de29
`

    const parser = new DiffParser()
    const diff = parser.parse(diffText)
    expect(diff.sections.length).to.equal(0)
  })

  it('parses hunk headers with omitted line counts from new file', () => {
    const diffText = `diff --git a/testste b/testste
new file mode 100644
index 0000000..f13588b
--- /dev/null
+++ b/testste
@@ -0,0 +1 @@
+asdfasdf
`

    const parser = new DiffParser()
    const diff = parser.parse(diffText)
    expect(diff.sections.length).to.equal(1)

    const section = diff.sections[0]
    expect(section.range.oldStartLine).to.equal(0)
    expect(section.range.oldLineCount).to.equal(0)
    expect(section.range.newStartLine).to.equal(1)
    expect(section.range.newLineCount).to.equal(1)
  })

  it('parses hunk headers with omitted line counts from old file', () => {
    const diffText = `diff --git a/testste b/testste
new file mode 100644
index 0000000..f13588b
--- /dev/null
+++ b/testste
@@ -1 +0,0 @@
-asdfasdf
`

    const parser = new DiffParser()
    const diff = parser.parse(diffText)
    expect(diff.sections.length).to.equal(1)

    const section = diff.sections[0]
    expect(section.range.oldStartLine).to.equal(1)
    expect(section.range.oldLineCount).to.equal(1)
    expect(section.range.newStartLine).to.equal(0)
    expect(section.range.newLineCount).to.equal(0)
  })