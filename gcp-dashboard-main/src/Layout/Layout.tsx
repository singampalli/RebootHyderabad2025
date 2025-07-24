import type { ReactNode } from "react";
import Header from "./Header";
import { Box, Container, Typography } from "@mui/material";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main>
        <Box
          sx={{
            height: "90vh", // take full viewport height
            width: "100vw", // take full viewport width
            display: "flex",
            justifyContent: "flex-start", // 🔑 Aligns items from start
            alignItems: "flex-start",
            boxSizing: "border-box", // avoid content spill
          }}
        >
          <Container
            maxWidth="md"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </Container>
        </Box>
      </main>
      <Box
        component="footer"
        sx={{
          height: "5vh", // take full viewport height
          width: "100vw", // take full viewport width
          textAlign: "center",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} GCP Dashboard. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}
