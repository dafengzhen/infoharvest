export default function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-100 text-base-content">
      <aside>
        <p className="text-center text-sm leading-loose text-muted-foreground">
          Built by&nbsp;
          <a
            href="https://www.infoharvest.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            infoharvest
          </a>
          . The source code is available on&nbsp;
          <a
            href="https://github.com/dafengzhen/infoharvest"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </aside>
    </footer>
  );
}
