---
title: Coding Style
slug: coding-style
---
# Coding Style

[750](#750)

# 15\. Coding Style

[751](#751)

This chapter documents the coding style used in live systems.

[752](#752)

15.1 Compatibility

[753](#753)

-   Avoid "bashisms", the codebase must be POSIX compliant and thus universally compatible.

[754](#754)

-   Furthermore it must comply with the version of the POSIX specification chosen by the current Debian Policy.

[755](#755)

-   You can check your scripts with 'sh -n' and 'checkbashisms'.

[756](#756)

-   Make sure all shell code runs with 'set -e'.

[757](#757)

15.2 Indenting

[758](#758)

-   Always use tabs over spaces.

[759](#759)

-   Keep case branch terminators (";;") aligned with the "content" of the branch, rather than the branch "entry".

[760](#760)

Good:

[761](#761)

case "${1}" in  
         foo)  
                 foobar  
                 ;;  
  
         bar)  
                 foobar  
                 ;;  
esac  

[762](#762)

15.3 Wrapping

[763](#763)

-   Generally, lines should be 80 chars at maximum.

[764](#764)

-   Placement of keywords like then and do should be chosen with good judgement with respect to clutter and readability. For small bits of code in particular it should be preferred to have them on the same line as the prior keyword they relate to (if; for; etc). Only place on the next line where it makes good sense to do so; typically this might only be to comply with maximum line length restrictions. One situation where they should always be placed on the next line is where what they follow is broken up onto multiple lines, and thus it being on a new line creates clear separation between that and the body of code following it. I.e. :

[765](#765)

Preferred:

[766](#766)

if foo; then  
         bar  
fi  
  
for FOO in $ITEMS; do  
         bar  
done  
  
if \[ "${MY\_LOCATION\_VARIABLE}" = "something" \] && \[ -e "${MY\_OUTPUT\_FILE}" \]  
then  
         MY\_OTHER\_VARIABLE="$(some\_bin ${FOOBAR} | awk -F\_ '{ print $1 }')"  
fi  
  
if \[ "${MY\_FOO}" = "something" \] && \[ -e "path/${FILE\_1}" \] ||  
   \[ "${MY\_BAR}" = "something\_else" \] && \[ ${ALLOW} = "true" \]  
then  
         foobar  
fi  

[767](#767)

Less ideal:

[768](#768)

if \[ "${MY\_LOCATION\_VARIABLE}" = "something" \] && \[ -e "${MY\_OUTPUT\_FILE}" \]; then  
         MY\_OTHER\_VARIABLE="$(some\_bin ${FOOBAR} | awk -F\_ '{ print $1 }')"  
fi  

[769](#769)

Horrible:

[770](#770)

if \[ "${MY\_LOCATION\_VARIABLE}" = "something" \] && \[ -e "${MY\_OUTPUT\_FILE}" \] || \[ "${MY\_LOCATION\_VARIABLE}" = "something-else" \] && \[ -e "${MY\_OUTPUT\_FILE\_2}" \]; then  
         MY\_OTHER\_VARIABLE="$(some\_bin ${FOOBAR} | awk -F\_ '{ print $1 }')"  
fi  

[771](#771)

-   Prefer placing the opening brace of a function on a new line (for consistency with established style), and keep the braces aligned with the function name:

[772](#772)

Good:

[773](#773)

Foo ()  
{  
         bar  
}  

[774](#774)

Bad (inconsistent with existing style):

[775](#775)

Foo () {  
         bar  
}  

[776](#776)

Awful:

[777](#777)

Foo ()  
         {  
         bar  
         }  

[778](#778)

15.4 Variables

[779](#779)

-   Variables are always in capital letters.

[780](#780)

-   Config variables used in _live-build_ should start with an LB\_ prefix.

[781](#781)

-   Local function variables should be restricted to local scope.

[782](#782)

-   Variables in connection to a boot parameter in _live-config_ start with LIVE\_.

[783](#783)

-   All other variables in _live-config_ start with \_ prefix.

[784](#784)

-   Use braces around variables; e.g. write ${FOO} instead of $FOO.

[785](#785)

-   Always protect variables with quotes to respect potential whitespaces (except where necessary to achieve correct word splitting): write "${FOO}" not ${FOO}.

[786](#786)

-   For consistency reasons, always use quotes when assigning values to variables:

[787](#787)

Bad:

[788](#788)

FOO=bar  

[789](#789)

Good:

[790](#790)

FOO="bar"  

[791](#791)

-   If multiple variables are used, prefer quoting the full expression:

[792](#792)

Typically bad:

[793](#793)

if \[ -f "${FOO}"/foo/"${BAR}"/bar \]; then  
         foobar  
fi  

[794](#794)

Good:

[795](#795)

if \[ -f "${FOO}/foo/${BAR}/bar" \]; then  
         foobar  
fi  

[796](#796)

15.5 Miscellaneous

[797](#797)

-   Prefer "|" (without the surround quotes) as a separator in calls to sed, e.g. "sed -e 's|foo|bar|'" (without "").

[798](#798)

-   Don't use the test command for comparisons or tests, use "\[" and "\]" (without ""); e.g. "if \[ -x /bin/foo \]; ..." and not "if test -x /bin/foo; ...".

[799](#799)

-   Use case wherever it makes code more readable than conditional checks (if foo; ... and tests without the actual if keyword, e.g. \[ -e "${FILE}" \] || exit 0).

[800](#800)

-   Use "Foo\_bar" style names for functions, i.e. a capital first letter, then all lowercase, with sensible use of underscores for better readability.
