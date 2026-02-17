export function FullScreenLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium">Cargando...</div>
        <div className="text-sm text-muted-foreground">Verificando sesion</div>
      </div>
    </div>
  );
}
