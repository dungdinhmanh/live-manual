---
title: Contributing To Project
slug: contributing-to-project
---
# Contributing to the project

[677](#677)

# 13\. Contributing to the project

[678](#678)

When submitting a contribution, please clearly identify its copyright holder and include any applicable licensing statement. Note that to be accepted, the contribution must be licensed under the same license as the rest of the documents, namely, GPL version 3 or later.

[679](#679)

Contributions to the project, such as translations and patches, are greatly welcome. Anyone can send merge requests. The projects are hosted on Salsa: ‹[https://salsa.debian.org/live-team](https://salsa.debian.org/live-team)› follow Salsa's documentation for instructions on how to contribute.

[680](#680)

Even though all commits might be revised, we ask you to use your common sense and make good commits with good commit messages.

[681](#681)

-   Write commit messages that consist of complete, meaningful sentences in English, starting with a capital letter and ending with a full stop. Usually, these will start with the form "Fixing/Adding/Removing/Correcting/Translating/...".

[682](#682)

-   Write good commit messages. The first line must be an accurate summary of the contents of the commit which will be included in the changelog. If you need to make some further explanations, write them below leaving a blank line after the first one and then another blank line after each paragraph. Lines of paragraphs should not exceed 80 characters in length.

[683](#683)

-   Commit atomically, this is to say, do not mix unrelated things in the same commit. Make one different commit for each change you make.

[684](#684)

13.1 Translation of man pages

[685](#685)

You can also contribute to the project working on the translation of the man pages for the different live-\* packages that the project maintains. The procedure is different depending on whether you are starting a translation from scratch or continue working on an already existing one:

[686](#686)

-   Working on an already existing translation

[687](#687)

If you want to maintain the translation of an already existing language you have to make your changes to your manpages/po/${LANGUAGE}/\*.po file or files and then run make rebuild from inside the manpages/ directory. This will update the actual man pages in manpages/${LANGUAGE}/\*

[688](#688)

-   Starting a new translation from scratch

[689](#689)

In order to add a new translation of any of the project's man pages you have to follow a similar procedure. It could be summarized as follows:

[690](#690)

-   Open the manpages/pot/ file or files in your favourite editor, such as _poedit_, and save it as a .po file in manpages/po/${LANGUAGE}/. (You will have to create your ${LANGUAGE}/ directory).

[691](#691)

-   Run make rebuild from inside the manpages/ directory to create the manpages/${LANGUAGE}/ files which will contain the actual man pages.

[692](#692)

Remember that you will have to add all the directories and files, then make the commit and finally push to the git server.
