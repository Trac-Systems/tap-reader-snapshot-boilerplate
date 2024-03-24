# TAP Reader Snapshot Boilerplate

This boilerplate extends a tap reader to allow for creating token snapshots for tokens on the TAP Protocol.

It will take a snaphot for a given token and store the snapshot results in the file "out.csv" in the root-directory of your TAP Reader.

# Requirements

- NodeJS 20+
- TAP Reader (https://github.com/Trac-Systems/tap-reader)

# Installation & Execution

Clone this boilerplate first:

```
git clone https://github.com/Trac-Systems/tap-reader-snapshot-boilerplate.git
cd tap-reader-snapshot-boilerplate
```

Then...

- read the comments in the file "main.mjs" of the cloned boilerplate repository.
- install TAP Reader as of its installation instructions (see requirements above).
- in the TAP Reader, replace the file "src/main.mjs" with the file "main.mjs" of the cloned boilerplate repository.
- open the replaced "main.mjs" file and make adjustments to the token ticker and decimals your snapshot will be for.

Start the TAP Reader and wait for the snapshot to be finished. The results will be stored in the file "out.csv" in the root-directory of TAP Reader.

If you don't need snapshot anymore, please replace the original "main.mjs" again.
